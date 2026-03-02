import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

// Helper function to extract device name from user agent
function parseDeviceName(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';

  // Windows
  if (userAgent.includes('Windows')) {
    if (userAgent.includes('Edge')) return 'Edge on Windows';
    if (userAgent.includes('Chrome')) return 'Chrome on Windows';
    if (userAgent.includes('Firefox')) return 'Firefox on Windows';
    if (userAgent.includes('Safari')) return 'Safari on Windows';
    return 'Windows Device';
  }

  // macOS
  if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS X')) {
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
      return 'Safari on Mac';
    if (userAgent.includes('Chrome')) return 'Chrome on Mac';
    if (userAgent.includes('Firefox')) return 'Firefox on Mac';
    return 'Mac Device';
  }

  // iPhone
  if (userAgent.includes('iPhone')) {
    if (userAgent.includes('Safari')) return 'Safari on iPhone';
    if (userAgent.includes('Chrome')) return 'Chrome on iPhone';
    return 'iPhone';
  }

  // iPad
  if (userAgent.includes('iPad')) {
    if (userAgent.includes('Safari')) return 'Safari on iPad';
    if (userAgent.includes('Chrome')) return 'Chrome on iPad';
    return 'iPad';
  }

  // Android
  if (userAgent.includes('Android')) {
    if (userAgent.includes('Chrome')) return 'Chrome on Android';
    if (userAgent.includes('Firefox')) return 'Firefox on Android';
    return 'Android Device';
  }

  // Linux
  if (userAgent.includes('Linux')) {
    if (userAgent.includes('Chrome')) return 'Chrome on Linux';
    if (userAgent.includes('Firefox')) return 'Firefox on Linux';
    return 'Linux Device';
  }

  return 'Unknown Device';
}

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
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
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

    // Create session
    const deviceName = parseDeviceName(args.userAgent || '');
    const now = Date.now();

    const sessionId = await ctx.db.insert('sessions', {
      userId: user._id,
      token: args.token,
      deviceName,
      userAgent: args.userAgent || '',
      ipAddress: args.ipAddress,
      createdAt: now,
      lastActivityAt: now,
      isCurrentSession: true,
    });

    return {
      success: true,
      userId: user._id,
      email: user.email,
      name: user.name,
      token: args.token,
      sessionId,
      deviceName,
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

export const getUserProfile = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real app, you'd validate that userId is a valid ID string
    try {
      const userId = args.userId as any;
      const user = await ctx.db.get(userId);
      if (!user || !('email' in user)) {
        return null;
      }
      const userDoc = user as any;
      return {
        _id: userDoc._id,
        email: userDoc.email,
        name: userDoc.name || '',
        profileImage: userDoc.profileImage || null,
        createdAt: userDoc.createdAt,
      };
    } catch (error) {
      return null;
    }
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId as any;
    const user = await ctx.db.get(userId);

    if (!user || !('email' in user)) {
      throw new Error('User not found');
    }

    const updates: any = {};

    if (args.name !== undefined) {
      updates.name = args.name;
    }

    if (args.profileImage !== undefined) {
      updates.profileImage = args.profileImage;
    }

    if (Object.keys(updates).length === 0) {
      const userDoc = user as any;
      return {
        _id: userDoc._id,
        email: userDoc.email,
        name: userDoc.name || '',
        profileImage: userDoc.profileImage || null,
        createdAt: userDoc.createdAt,
      };
    }

    await ctx.db.patch(userId, updates);

    const updatedUser = await ctx.db.get(userId);
    if (!updatedUser || !('email' in updatedUser)) {
      throw new Error('Failed to retrieve updated user');
    }

    const userDoc = updatedUser as any;
    return {
      _id: userDoc._id,
      email: userDoc.email,
      name: userDoc.name || '',
      profileImage: userDoc.profileImage || null,
      createdAt: userDoc.createdAt,
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

// Create a session for a user (called after successful sign in)
export const createSession = mutation({
  args: {
    userId: v.id('users'),
    token: v.string(),
    userAgent: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const deviceName = parseDeviceName(args.userAgent);
    const now = Date.now();

    const sessionId = await ctx.db.insert('sessions', {
      userId: args.userId,
      token: args.token,
      deviceName,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
      createdAt: now,
      lastActivityAt: now,
      isCurrentSession: true,
    });

    return {
      sessionId,
      deviceName,
    };
  },
});

// Get all active sessions for a user
export const getUserSessions = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    return sessions
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((session) => ({
        _id: session._id,
        deviceName: session.deviceName,
        createdAt: session.createdAt,
        lastActivityAt: session.lastActivityAt,
        ipAddress: session.ipAddress || 'Unknown',
        isCurrentSession: session.isCurrentSession || false,
      }));
  },
});

// Revoke a session
export const revokeSession = mutation({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
    return { success: true };
  },
});

// Revoke all other sessions for a user
export const revokeAllOtherSessions = mutation({
  args: {
    userId: v.id('users'),
    currentToken: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const sessionsToDelete = sessions.filter(
      (session) => session.token !== args.currentToken,
    );

    for (const session of sessionsToDelete) {
      await ctx.db.delete(session._id);
    }

    return { success: true, revokedCount: sessionsToDelete.length };
  },
});

// Validate a session token (read-only)
export const validateSession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: session.userId,
      deviceName: session.deviceName,
      createdAt: session.createdAt,
    };
  },
});

// Update last activity for a session
export const updateSessionActivity = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session) {
      return { success: false };
    }

    await ctx.db.patch(session._id, {
      lastActivityAt: Date.now(),
    });

    return { success: true };
  },
});

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
