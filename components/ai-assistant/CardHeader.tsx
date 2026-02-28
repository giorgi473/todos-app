'use client';

import { motion } from 'framer-motion';
import { Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BotMessageSquare } from 'lucide-react';

interface CardHeaderProps {
  onClearMessages: () => void;
  onClose: () => void;
  label?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  onClearMessages,
  onClose,
  label,
}) => {
  return (
    <div className="px-4 py-2 sm:py-2 select-none border-b border-gray-200/50 dark:border-neutral-800/50 bg-linear-to-r from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BotMessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
          {label && (
            <h3 className="font-bold text-sm sm:text-md md:text-lg text-gray-900 dark:text-white tracking-tight">
              {label}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onClearMessages}
              variant="ghost"
              size="icon"
              className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-neutral-900"
            >
              <Trash className="w-4 sm:w-5 h-4 sm:h-5" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onClose}
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
  );
};
