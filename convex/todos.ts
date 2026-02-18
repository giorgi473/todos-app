import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ყველა todo-ს მიღება
export const list = query({
  args: { completed: v.optional(v.boolean()) },
  handler: async (ctx, { completed }) => {
    if (completed !== undefined) {
      return await ctx.db
        .query("todos")
        .withIndex("by_completed", (q) => q.eq("completed", completed))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("todos").order("desc").collect();
  },
});

// ერთი todo-ს მიღება
export const get = query({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// todo-ს შექმნა
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("todos", {
      ...args,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

// todo-ს განახლება
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    return await ctx.db.patch(id, fields);
  },
});

// completed toggle
export const toggleComplete = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error("Todo not found");
    return await ctx.db.patch(id, { completed: !todo.completed });
  },
});

// todo-ს წაშლა
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});