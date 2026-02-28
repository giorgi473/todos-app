'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Message, FoundTodo, AskAiProps } from './types';
import { AskAiButton } from './AskAiButton';
import { AskAiCard } from './AskAiCard';
import { FoundTodoDialog } from './FoundTodoDialog';

export const AskAi: React.FC<AskAiProps> = ({
  isOpen,
  onOpenChange,
  label,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [foundTodo, setFoundTodo] = useState<FoundTodo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const askAssistant = useAction(api.ai.askAssistant);
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load user ID from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedId = window.localStorage.getItem('userId');
    setUserId(storedId);
  }, []);

  /**
   * Handle message submission
   */
  const handleSubmit = async (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      type: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const data = await askAssistant({
        userId: userId ?? undefined,
        question: messageText,
        messages: [...messages, newMessage]
          .slice(-8)
          .map((msg) => ({ id: msg.id, text: msg.text, type: msg.type })),
      });

      // Check for matching todos
      const firstMatch = (data as { matches?: { id: string; title: string }[] })
        ?.matches?.[0];
      if (firstMatch?.id) {
        setFoundTodo(firstMatch);
        setIsDialogOpen(true);
      }

      // Add AI response
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        text:
          (data as { reply?: string })?.reply ??
          "I'm having trouble reaching the AI service right now. Please try again in a moment.",
        type: 'ai',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `${Date.now()}-ai-error`,
        text: 'Something went wrong talking to the AI service. Your todos are safe — please try asking again.',
        type: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle viewing a found todo
   */
  const handleViewTodo = (todo: FoundTodo) => {
    const search = encodeURIComponent(todo.title);
    const highlight = encodeURIComponent(todo.id);
    router.push(`/todos?search=${search}&page=1&highlight=${highlight}`);
  };

  return (
    <>
      <AskAiButton
        isOpen={isOpen}
        onClick={() => onOpenChange(!isOpen)}
        label={label}
      />

      <AskAiCard
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        label={label}
        messages={messages}
        onClearMessages={() => setMessages([])}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        messagesEndRef={messagesEndRef}
      />

      <FoundTodoDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        foundTodo={foundTodo}
        onViewTodo={handleViewTodo}
      />
    </>
  );
};
