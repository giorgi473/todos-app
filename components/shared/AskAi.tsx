'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { BotMessageSquare, Minimize, Trash, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useState, useRef, useEffect } from 'react';

const askAiSchema = z.object({
  message: z.string().min(1, 'Please enter a message'),
});

type AskAiFormValues = z.infer<typeof askAiSchema>;

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
}

interface AskAiProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function AskAi({ isOpen, onOpenChange }: AskAiProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const form = useForm<AskAiFormValues>({
    resolver: zodResolver(askAiSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: AskAiFormValues) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: values.message,
      type: 'user',
    };
    setMessages([...messages, newMessage]);
    form.reset();

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'This is a demo response. Connect your AI service here!',
        type: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <Button
        variant={'outline'}
        onClick={() => onOpenChange(!isOpen)}
        className="gap-2 rounded-xs border-none cursor-pointer"
      >
        <BotMessageSquare size={18} />
        Ask AI
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-2 left-2 right-2 sm:bottom-6 sm:right-6 sm:left-auto z-50 w-auto sm:w-96 lg:w-105"
            initial={{ opacity: 0, y: 100, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 100, x: 400 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Card className="bg-white/95 dark:bg-neutral-950 gap-0 p-0 mx-2 md:px-0 border border-gray-200 dark:border-neutral-800 rounded-sm h-87.5 sm:h-100 md:h-112.5 flex flex-col overflow-hidden transition-all duration-200">
              <div className="px-4 py-2 sm:py-2 select-none border-b border-gray-200/50 dark:border-neutral-800/50 bg-linear-to-r from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BotMessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    <h3 className="font-bold text-sm sm:text-md md:text-lg text-gray-900 dark:text-white tracking-tight">
                      Ask AI
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-neutral-900"
                      >
                        <Minimize className="w-4 sm:w-5 h-4 sm:h-5" />
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-neutral-900"
                      >
                        <Trash className="w-4 sm:w-5 h-4 sm:h-5" />
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => onOpenChange(false)}
                        variant="ghost"
                        size="icon"
                        className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-neutral-900"
                      >
                        <X className="w-4 sm:w-5 h-4 sm:h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              <style>{`
                .ask-ai-messages::-webkit-scrollbar {
                  display: none;
                }
                .ask-ai-messages {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              <div className="ask-ai-messages flex-1 overflow-y-auto space-y-3 sm:space-y-4 px-4 sm:px-6 py-4 sm:py-6">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-3"
                  >
                    <div className="p-5 sm:p-6 bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-transparent rounded-full">
                      <BotMessageSquare className="w-10 sm:w-12 h-10 sm:h-12 text-orange-500 dark:text-orange-400" />
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                      No messages yet
                    </p>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      Start the conversation!
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <AnimatePresence mode="popLayout">
                      {messages.map((msg, index) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.type === 'user'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] sm:max-w-[65%] md:max-w-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-sm text-sm sm:text-sm wrap-break-word shadow-md font-medium ${
                              msg.type === 'user'
                                ? 'bg-linear-to-br from-orange-400 to-orange-500 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{
                                duration: 1.4,
                                delay: i * 0.2,
                                repeat: Infinity,
                              }}
                              className="w-1 h-1 bg-gray-600 dark:bg-gray-500 rounded-full"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="px-4 py-3 sm:py-4 border-t border-gray-200/50 dark:border-neutral-800/50 bg-linear-to-t from-white/50 to-transparent dark:from-neutral-950/50 dark:to-transparent">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-2 sm:gap-3"
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Ask me anything..."
                              disabled={isLoading}
                              className="px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 focus:border-transparent dark:focus:ring-orange-400 text-sm sm:text-base font-medium transition-all"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-sm sm:text-base whitespace-nowrap flex items-center gap-2 sm:gap-2.5 rounded-sm transition-all"
                      >
                        {isLoading ? (
                          <motion.div>
                            <Send size={20} />
                          </motion.div>
                        ) : (
                          <>
                            <Send size={20} />
                            <span className="hidden sm:inline">Send</span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AskAi;
