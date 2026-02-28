'use client';

import { motion } from 'framer-motion';
import { BotMessageSquare } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full text-center gap-3"
    >
      <div className="p-5 sm:p-6 bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-transparent rounded-full">
        <BotMessageSquare className="w-10 sm:w-12 h-10 sm:h-12 text-[#FF9D4D]" />
      </div>
      <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
        No messages yet
      </p>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        Start the conversation!
      </p>
    </motion.div>
  );
};
