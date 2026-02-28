'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CardHeader } from './CardHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AskAiCardProps } from './types';

export const AskAiCard: React.FC<AskAiCardProps> = ({
  isOpen,
  onOpenChange,
  label,
  messages,
  onClearMessages,
  isLoading,
  onSubmit,
  messagesEndRef,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-2 left-2 right-2 sm:bottom-6 sm:right-6 sm:left-auto z-50 w-auto sm:w-96 lg:w-105"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card className="bg-neutral-950 gap-0 p-0 mx-2 md:px-0 border border-gray-200 dark:border-neutral-800 rounded-sm h-87.5 sm:h-100 md:h-112.5 flex flex-col overflow-hidden transition-all duration-200">
            <CardHeader
              onClearMessages={onClearMessages}
              onClose={() => onOpenChange(false)}
              label={label}
              
            />

            <style jsx global>{`
              .ask-ai-messages::-webkit-scrollbar {
                width: 3px;
              }
              .ask-ai-messages::-webkit-scrollbar-track {
                background: #0a0a0a;
                border-radius: 0px;
              }
              .ask-ai-messages::-webkit-scrollbar-thumb {
                background: #ff9d4d;
                border-radius: 0px;
              }
              .ask-ai-textarea {
                scrollbar-width: none;
              }
              .ask-ai-textarea::-webkit-scrollbar {
                width: 0;
                height: 0;
              }
            `}</style>

            <MessageList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />

            <MessageInput onSubmit={onSubmit} isLoading={isLoading} />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
