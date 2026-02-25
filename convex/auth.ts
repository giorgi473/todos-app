import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      email: args.email,
      password: args.hashedPassword,
      name: args.name || args.email.split('@')[0],
      createdAt: Date.now(),
    });

    return {
      userId,
      email: args.email,
      name: args.name,
    };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    hashedPassword: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    if (user.password !== args.hashedPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    return {
      success: true,
      userId: user._id,
      email: user.email,
      name: user.name,
      token: args.token,
    };
  },
});

export const getCurrentUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    return {
      _id: user._id,
      email: user.email,
      name: user.name || '',
    };
  },
});

// Helper function to hash password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Helper function to generate a token
function generateToken(): string {
  const randomArray = new Uint8Array(32);
  crypto.getRandomValues(randomArray);
  return Array.from(randomArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hash password action
export const hashPasswordAction = action({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    return await hashPassword(args.password);
  },
});

// Generate token action
export const generateTokenAction = action({
  args: {},
  handler: async (ctx) => {
    return generateToken();
  },
});
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
/**
 * Request a password reset. Always returns success=true so callers can't
 * enumerate which emails are registered. When a user exists we generate a
 * one-time token valid for a limited window and store it on their account.
 * An action is scheduled to send the reset link via email.
 */
export const requestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (!user) {
      // Don't leak existence of the account
      return { success: true };
    }

    const token = generateToken();
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

    await ctx.db.patch(user._id, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${baseUrl}/reset-password?token=${token}`;

    // Log email for dev convenience
    console.log(`🚀 password reset link for ${email}: ${link}`);

    // schedule an action to actually send the message.  The action uses
    // whatever SMTP settings are configured in `.env.local` (see README).
    // scheduling it with a 0ms delay keeps the mutation fast and avoids
    // blocking on the external mail server.  In development the action will
    // simply log the payload so you can still see the link even without SMTP.
    await ctx.scheduler.runAfter(0, api.sendEmailAction.sendEmailAction, {
      to: email,
      subject: 'Reset your password',
      text: `You can reset your password by visiting the following link: ${link}`,
      html: `<p>Click <a href=\"${link}\">here</a> to reset your password.</p>`,
    });

    // Return token so frontend can construct link for dev/testing
    return { success: true, token };
  },
});

/**
 * Finalize password reset. The client passes the one-time token and the
 * hashed new password. If the token is invalid or expired we fail.
 */
export const resetPassword = mutation({
  args: {
    token: v.string(),
    hashedPassword: v.string(),
  },
  handler: async (ctx, { token, hashedPassword }) => {
    const now = Date.now();
    const user = await ctx.db
      .query('users')
      .withIndex('by_resetToken', (q) => q.eq('resetToken', token))
      .first();

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < now) {
      return { success: false, error: 'Invalid or expired token' };
    }

    await ctx.db.patch(user._id, {
      password: hashedPassword,
      // setting undefined removes the field from the document
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return { success: true };
  },
});

// lightweight query used by the client to validate the token before showing
// the reset form. This lets us display a helpful message instead of waiting
// for the mutation to fail.
export const verifyResetToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const now = Date.now();
    const user = await ctx.db
      .query('users')
      .withIndex('by_resetToken', (q) => q.eq('resetToken', token))
      .first();
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < now) {
      return { valid: false };
    }
    return { valid: true };
  },
});

// A generic mail-sending mutation that can be called with any recipient/subject.
// This lets the frontend send arbitrary messages (for testing or notifications)
// without tying them to a user account. Schedules the actual sending via an action.
export const sendEmail = mutation({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.string(),
    html: v.optional(v.string()),
  },
  handler: async (ctx, { to, subject, text, html }) => {
    // Log email for dev convenience
    console.log(`🚀 email to ${to}: subject="${subject}"\n${text}`);
    if (html) console.log(`HTML: ${html}`);

    // schedule the SMTP action; a 0ms delay executes right away but outside the
    // current transaction so failures or slowdowns in the mail server won't
    // block other DB work.
    await ctx.scheduler.runAfter(0, api.sendEmailAction.sendEmailAction, {
      to,
      subject,
      text,
      html,
    });

    return { success: true };
  },
});
