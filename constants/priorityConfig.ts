export const priorityConfig = {
  low: {
    label: 'Low',
    dot: 'bg-emerald-400',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-muted dark:text-emerald-600',
  },
  medium: {
    label: 'Medium',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-muted dark:text-amber-600',
  },
  high: {
    label: 'High',
    dot: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-700 dark:bg-muted dark:text-rose-600',
  },
} as const;
