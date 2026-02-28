'use client';

import { motion } from 'framer-motion';

export const MessageLoader: React.FC = () => {
  return (
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
  );
};
