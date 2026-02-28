import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

type Priority = 'low' | 'medium' | 'high';

interface TodoForRag {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: number;
  createdAt: number;
}

function buildTodoContext(
  todos: TodoForRag[],
  question: string,
): { contextText: string; topTodos: TodoForRag[] } {
  if (!todos || todos.length === 0) {
    return { contextText: 'User has no todos yet.', topTodos: [] };
  }

  const q = question.toLowerCase();
  const keywords = q
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2);

  const scored = todos.map((todo) => {
    const haystack = `${todo.title} ${todo.description ?? ''}`.toLowerCase();
    let score = 0;
    for (const word of keywords) {
      if (haystack.includes(word)) score += 2;
    }
    if (!todo.completed) score += 1;
    return { todo, score };
  });

  scored.sort(
    (a, b) => b.score - a.score || b.todo.createdAt - a.todo.createdAt,
  );

  const topTodos = scored
    .filter((item) => item.score > 0)
    .slice(0, 12)
    .map((item) => item.todo);

  const effectiveTodos =
    topTodos.length > 0
      ? topTodos
      : [...todos].sort((a, b) => b.createdAt - a.createdAt).slice(0, 12);

  const contextLines = effectiveTodos.map((t, index) => {
    const status = t.completed ? 'completed' : 'pending';
    const priority = t.priority ?? 'medium';
    const desc = t.description ? ` — ${t.description}` : '';
    return `${index + 1}. [${status} | ${priority}] ${t.title}${desc}`;
  });

  return {
    contextText: contextLines.join('\n'),
    topTodos: effectiveTodos,
  };
}

function buildRuleBasedAnswer(
  question: string,
  todos: TodoForRag[],
  contextText: string,
): string {
  if (!todos.length) {
    return `You don't have any todos yet. Click 'New Todo' and add your first task, then ask me: 'What should I do first?'.`;
  }

  const lowerQ = question.toLowerCase();
  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  const priorityOrder: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const importantPending = [...pending].sort((a, b) => {
    const pa = priorityOrder[a.priority ?? 'medium'];
    const pb = priorityOrder[b.priority ?? 'medium'];
    if (pa !== pb) return pa - pb;
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
      return a.dueDate - b.dueDate;
    }
    return a.createdAt - b.createdAt;
  });

  const top3 = importantPending.slice(0, 3);

  // თუ აშკარად კითხულობს "რა გავაკეთო"/"what next"
  const isNextActionQuestion =
    (lowerQ.includes('რა') && lowerQ.includes('ვქნა')) ||
    lowerQ.includes('რა გავაკეთო') ||
    lowerQ.includes('what should i do') ||
    lowerQ.includes('what next') ||
    lowerQ.includes('priorit');

  if (isNextActionQuestion && top3.length) {
    const lines = top3.map((t, i) => {
      const why =
        t.priority === 'high'
          ? '— High priority.'
          : t.dueDate
            ? '— Has a due date, should be done soon.'
            : '— Has been in your list for a while.';
      return `${i + 1}. ${t.title} ${why}`;
    });

    return [
      "Based on your tasks, here's how I'd prioritize:",
      '',
      ...lines,
      '',
      `You have ${pending.length} pending and ${completed.length} completed todos.`,
    ].join('\n');
  }

  // ზოგადი "ძებნა" / "მაჩვენე" ტიპის პასუხი
  const { topTodos } = buildTodoContext(todos, question);
  if (!topTodos.length) {
    return "I couldn't find a specific todo related to your question. Try different words or be more specific about the title/description.";
  }

  const matchLines = topTodos.slice(0, 5).map((t, i) => {
    const status = t.completed ? 'completed' : 'pending';
    const priority =
      t.priority === 'high' ? 'high' : t.priority === 'low' ? 'low' : 'medium';
    return `${i + 1}. [${status} | ${priority}] ${t.title}${t.description ? ` — ${t.description}` : ''}`;
  });

  return [
    "Here's what I found from your todos related to this question:",
    '',
    ...matchLines,
    '',
    `You have ${pending.length} active and ${completed.length} completed tasks.`,
  ].join('\n');
}

export const askAssistant = action({
  args: {
    userId: v.optional(v.string()),
    question: v.string(),
    messages: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        type: v.union(v.literal('user'), v.literal('ai')),
      }),
    ),
  },
  handler: async (ctx, { userId, question, messages }) => {
    let todos: TodoForRag[] = [];

    if (userId) {
      const result = (await ctx.runQuery(api.todos.list, {
        userId,
        page: 1,
      })) as { todos?: TodoForRag[] } | null;
      todos = (result?.todos ?? []) as TodoForRag[];
    }

    const { contextText, topTodos } = buildTodoContext(todos, question);
    const matches = topTodos.slice(0, 5).map((t) => ({
      id: t._id,
      title: t.title,
    }));

    // messages და topTodos გვაქვს, გეგმაშია სურვილზე history-ს ანგარიში,
    // მაგრამ ამ ეტაპზე პასუხს თვითონ todos-ის საფუძველზე ვქმნით.
    const reply = buildRuleBasedAnswer(
      question,
      topTodos.length ? topTodos : todos,
      contextText,
    );

    return { reply, matches };
  },
});
