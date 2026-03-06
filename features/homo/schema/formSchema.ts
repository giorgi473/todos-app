import z from 'zod';

export const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Maximum 100 characters'),
  description: z.string().max(500, 'Maximum 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  imageUrls: z.array(z.string()).optional(),
});
