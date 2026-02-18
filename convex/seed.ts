import { mutation } from "./_generated/server";

export const seedTodos = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = [
      {
        title: "Next.js პროექტის დაყენება",
        description: "App Router, TypeScript, Tailwind",
        priority: "high" as const,
        completed: true,
        createdAt: Date.now(),
      },
      {
        title: "Convex სქემის შექმნა",
        description: "Todo ცხრილი ინდექსებით",
        priority: "high" as const,
        completed: true,
        createdAt: Date.now(),
      },
      {
        title: "shadcn/ui კომპონენტები",
        description: "Button, Card, Input, Checkbox",
        priority: "medium" as const,
        completed: false,
        createdAt: Date.now(),
      },
      {
        title: "Auth დამატება",
        description: "Convex Auth ან Clerk",
        priority: "medium" as const,
        completed: false,
        createdAt: Date.now(),
      },
      {
        title: "Deploy Vercel-ზე",
        priority: "low" as const,
        completed: false,
        createdAt: Date.now(),
      },
    ];

    for (const todo of todos) {
      await ctx.db.insert("todos", todo);
    }

    return `${todos.length} todo დაემატა!`;
  },
});