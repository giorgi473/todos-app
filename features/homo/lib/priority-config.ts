export const priorityConfig = [
  {
    value: 'low' as const,
    label: 'Low',
    dot: 'bg-emerald-400',
    submit: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  {
    value: 'medium' as const,
    label: 'Medium',
    dot: 'bg-amber-400',
    submit: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  {
    value: 'high' as const,
    label: 'High',
    dot: 'bg-rose-400',
    submit: 'bg-rose-500 hover:bg-rose-600 text-white',
  },
] as const;
