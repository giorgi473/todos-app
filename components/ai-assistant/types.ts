export interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
  timestamp: number;
}

export interface FoundTodo {
  id: string;
  title: string;
}

export interface AskAiProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  label?: string;
}

export interface AskAiCardProps {
  isOpen: boolean;
  label?: string;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  onClearMessages: () => void;
  isLoading: boolean;
  onSubmit: (message: string) => void;
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
}

export interface MessageInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export interface FoundTodoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  foundTodo: FoundTodo | null;
  onViewTodo: (todo: FoundTodo) => void;
}
