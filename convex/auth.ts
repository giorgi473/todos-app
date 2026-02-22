import { mutation, query, action } from './_generated/server';
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
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (user.password !== args.hashedPassword) {
      throw new Error('Invalid email or password');
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
