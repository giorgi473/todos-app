'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BotMessageSquare, Minimize, Trash, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const askAiSchema = z.object({
  message: z.string().min(1, 'Please enter a message'),
});

type AskAiFormValues = z.infer<typeof askAiSchema>;

interface AskAiProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function AskAi({ isOpen, onOpenChange }: AskAiProps) {
  const form = useForm<AskAiFormValues>({
    resolver: zodResolver(askAiSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (values: AskAiFormValues) => {
    console.log('Message:', values.message);
    form.reset();
  };

  return (
    <>
      <Button
        onClick={() => onOpenChange(!isOpen)}
        variant="outline"
        className="gap-2 rounded-xs border-none cursor-pointer"
      >
        <BotMessageSquare />
        Ask Ai
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-96"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 rounded-sm pt-3 dark:border-neutral-800">
              <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BotMessageSquare className="w-5 h-5" />
                    <h3 className="font-semibold text-md">Ask AI</h3>
                  </div>
                  <div className="flex items-center">
                    <button className="p-1 hover:bg-neutral-100 cursor-pointer dark:hover:bg-neutral-800 rounded-sm transition-colors">
                      <Minimize className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-neutral-100 cursor-pointer dark:hover:bg-neutral-800 rounded-sm transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenChange(false)}
                      className="p-1 hover:bg-neutral-100 cursor-pointer dark:hover:bg-neutral-800 rounded-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex items-center gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Ask me anything..."
                              className="flex-1 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="px-3 py-2 bg-[#ff9D4D] hover:bg-[#ff9D4D]/90 rounded-sm text-white cursor-pointer text-xs whitespace-nowrap"
                    >
                      Send
                    </Button>
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
