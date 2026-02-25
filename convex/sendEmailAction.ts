import { action } from './_generated/server';
import { v } from 'convex/values';

export const sendEmailAction = action({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.string(),
    html: v.optional(v.string()),
  },
  handler: async (ctx, { to, subject, text, html }) => {
    return {
      success: true,
      messageId: `dev-email-${Date.now()}`,
    };
  },
});
