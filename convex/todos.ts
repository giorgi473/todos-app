import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const PAGE_SIZE = 10;

function partial<T>(fields: T) {
  return fields as T;
}
export const list = query({
  args: {
    page: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, { page, completed }) => {
    const currentPage = page && page > 0 ? page : 1;
    const skip = (currentPage - 1) * PAGE_SIZE;

    let q = ctx.db.query('todos').order('desc');

    if (completed !== undefined) {
      q = ctx.db
        .query('todos')
        .withIndex('by_completed', (ix) => ix.eq('completed', completed))
        .order('desc');
    }

    const all = await q.collect();
    const total = all.length;

    const todos = all.slice(skip, skip + PAGE_SIZE);

    return {
      todos,
      total,
      pageSize: PAGE_SIZE,
      page: currentPage,
    };
  },
});

export const get = query({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

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

export const toggleComplete = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error('Todo not found');
    return await ctx.db.patch(id, { completed: !todo.completed });
  },
});

export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
