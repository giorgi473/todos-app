'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { transliterateToEnglish } from './utils';
import { MessageInputProps } from './types';

const messageSchema = z.object({
  message: z.string().min(1, 'Please enter a message'),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export const MessageInput: React.FC<MessageInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleSubmit = async (values: MessageFormValues) => {
    onSubmit(values.message);
    form.reset();
  };

  return (
    <div className="px-4 py-3 sm:py-4 border-t border-gray-200/50 dark:border-neutral-800/50 bg-linear-to-t from-white/50 to-transparent dark:from-neutral-950/50 dark:to-transparent">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-2 sm:gap-3"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck="false"
                    onChange={(e) => {
                      const transliteratedText = transliterateToEnglish(
                        e.target.value,
                      );
                      field.onChange(transliteratedText);
                    }}
                    onInput={(e) => {
                      const input = e.currentTarget;
                      const transliteratedText = transliterateToEnglish(
                        input.value,
                      );
                      if (input.value !== transliteratedText) {
                        const cursorPos = input.selectionStart;
                        input.value = transliteratedText;
                        input.setSelectionRange(cursorPos, cursorPos);
                        field.onChange(transliteratedText);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)();
                      }
                    }}
                    className="ask-ai-textarea px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 focus:border-transparent dark:focus:ring-orange-400 text-sm sm:text-base font-medium transition-all min-h-18 max-h-18 overflow-y-auto resize-none"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-[#FF9D4D] to-[#FF9D4D] hover:from-[#FF9D4D] hover:to-[#FF9D4D] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-sm sm:text-base whitespace-nowrap flex items-center gap-2 sm:gap-2.5 rounded-sm transition-all"
            >
              <Send size={20} />
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};
