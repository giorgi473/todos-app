'use client';

import { Message } from './types';
import { formatMessageTime } from './utils';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUserMessage = message.type === 'user';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col gap-1">
        <div
          className={`max-w-[75%] sm:max-w-[65%] md:max-w-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-sm wrap-break-word shadow-md font-medium ${
            isUserMessage
              ? 'bg-linear-to-br from-[#FF9D4D] to-[#FF9D4D] text-white rounded-br-none'
              : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
          }`}
        >
          {message.text}
        </div>
        <div
          className={`text-xs font-medium px-1 ${
            isUserMessage
              ? 'text-gray-400 dark:text-gray-500 text-right'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
