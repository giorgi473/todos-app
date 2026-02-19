import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// პატარა helper, რომ patch ობიექტი იყოს „partial“
function partial<T>(fields: T) {
  return fields as T;
}

// ყველა todo-ს მიღება
export const list = query({
  args: { completed: v.optional(v.boolean()) },
  handler: async (ctx, { completed }) => {
    if (completed !== undefined) {
      return await ctx.db
        .query('todos')
        .withIndex('by_completed', (q) => q.eq('completed', completed))
        .order('desc')
        .collect();
    }
    return await ctx.db.query('todos').order('desc').collect();
  },
});

// ერთის მიღება
export const get = query({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// შექმნა
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('todos', {
      ...args,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

// განახლება – generalized patch
export const update = mutation({
  args: {
    id: v.id('todos'),
    patch: v.object(
      partial({
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        completed: v.optional(v.boolean()),
        priority: v.optional(
          v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
        ),
        dueDate: v.optional(v.number()),
        userId: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
  },
});

// completed toggle
export const toggleComplete = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error('Todo not found');
    return await ctx.db.patch(id, { completed: !todo.completed });
  },
});

// წაშლა
export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
