'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare } from 'lucide-react';

interface AskAiButtonProps {
  isOpen: boolean;
  onClick: () => void;
  label?: string;
}

export const AskAiButton: React.FC<AskAiButtonProps> = ({
  isOpen,
  onClick,
  label,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="gap-2 rounded-xs border-none cursor-pointer"
    >
      <BotMessageSquare size={18} />
      {label && <span>{label}</span>}
    </Button>
  );
};
