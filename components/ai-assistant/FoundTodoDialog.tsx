'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FoundTodo, FoundTodoDialogProps } from './types';

export const FoundTodoDialog: React.FC<FoundTodoDialogProps> = ({
  isOpen,
  onOpenChange,
  foundTodo,
  onViewTodo,
}) => {
  if (!foundTodo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#FF9D4D]">
            ✨ Found Todo
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 pt-2">
            AI found a matching todo based on your question
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="p-5 bg-linear-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200 dark:border-orange-900/30 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
              Todo
            </p>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug">
              {foundTodo.title}
            </h3>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                onViewTodo(foundTodo);
                onOpenChange(false);
              }}
              className="flex-1 bg-linear-to-r from-[#FF9D4D] to-orange-500 hover:from-[#FF8D3D] hover:to-orange-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              View Todo
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 rounded-lg font-semibold"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
