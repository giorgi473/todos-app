'use client';

import { AnimatePresence } from 'framer-motion';
import { MessageListProps } from './types';
import { MessageItem } from './MessageItem';
import { MessageLoader } from './MessageLoader';
import { EmptyState } from './EmptyState';

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className="ask-ai-messages flex-1 overflow-y-auto space-y-3 sm:space-y-4 px-4 sm:px-6 py-4 sm:py-6">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
          {isLoading && <MessageLoader />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
