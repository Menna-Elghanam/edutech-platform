import { z } from 'zod';

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  thumbnail: z.string().url("Thumbnail must be a valid URL.").optional().or(z.literal("")),
  featured: z.boolean().optional().default(false),
  duration: z.string().min(1, "Duration is required."),
  price: z.number().min(0, "Price must be 0 or greater."),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});