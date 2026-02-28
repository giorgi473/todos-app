import { NextRequest, NextResponse } from 'next/server';

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

interface AskAiRequestBody {
  userId: string | null;
  question: string;
  messages: { id: string; text: string; type: 'user' | 'ai' }[];
  todos: TodoForRag[];
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

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'OPENAI_API_KEY is not configured on the server. Add it to your environment to enable Ask AI.',
        },
        { status: 500 },
      );
    }

    const body = (await req.json()) as AskAiRequestBody;
    const { userId, question, messages, todos } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Missing question in request body.' },
        { status: 400 },
      );
    }

    const safeTodos = Array.isArray(todos) ? todos : [];
    const { contextText } = buildTodoContext(safeTodos, question);

    const conversationSnippet = (messages ?? [])
      .slice(-6)
      .map((m) => `${m.type === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const systemPrompt = `
You are an intelligent AI assistant embedded inside a modern todo application.
You have access to the user's current todos as context. Use ONLY that context when
talking about specific todos, and never invent tasks that are not listed.

Your goals:
- Help the user understand, search and plan based on their todos.
- When they ask "what should I do next" or similar, pick specific todos and justify why.
- When they reference something vaguely, match it to the closest todos by title/description/priority.
- Be concise but helpful. Prefer short paragraphs and bullets.
- You can suggest concrete actions (e.g. "mark X done", "increase priority of Y") but DO NOT claim you already modified data.
`;

    const userPrompt = `
User id (may be null): ${userId ?? 'anonymous'}

User question:
${question}

Relevant todos (from their personal list):
${contextText || 'No todos found.'}

Recent chat history:
${conversationSnippet || 'No previous messages.'}

Using ONLY the todos above as ground truth, answer the user's question.
If they ask to "find" or "show" something, explain which todos match and why.
If something is impossible with the current todos, explain what is missing.
`;

    const openaiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
        }),
      },
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return NextResponse.json(
        { error: 'Upstream AI provider returned an error.' },
        { status: 502 },
      );
    }

    const data = await openaiResponse.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ??
      'I could not generate a response right now.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Ask AI route error:', error);
    return NextResponse.json(
      { error: 'Unexpected error while handling Ask AI request.' },
      { status: 500 },
    );
  }
}
