import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()), // Base64 string or image URL
    createdAt: v.number(),
    // optional fields for password reset flow
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_resetToken', ['resetToken']),
  sessions: defineTable({
    userId: v.id('users'),
    token: v.string(),
    deviceName: v.string(),
    userAgent: v.string(),
    ipAddress: v.optional(v.string()),
    createdAt: v.number(),
    lastActivityAt: v.number(),
    isCurrentSession: v.optional(v.boolean()),
  })
    .index('by_userId', ['userId'])
    .index('by_token', ['token'])
    .index('by_createdAt', ['createdAt']),
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    dueDate: v.optional(v.number()), // timestamp
    userId: v.optional(v.string()),
    createdAt: v.number(), // timestamp
  })
    .index('by_completed', ['completed'])
    .index('by_priority', ['priority'])
    .index('by_user', ['userId']),
});
