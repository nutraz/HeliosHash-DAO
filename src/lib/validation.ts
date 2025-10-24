import { z } from 'zod';

export const loginInputSchema = z.object({
  userId: z.string().min(1).max(64),
  csrfToken: z.string().length(64),
  email: z.string().email(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/), // E.164
});

export const fileUploadSchema = z.object({
  mimetype: z.enum(['image/png', 'image/jpeg', 'application/pdf']),
  size: z.number().max(5 * 1024 * 1024), // 5MB
});

export const addressSchema = z.object({
  address: z.string().min(5).max(100),
  // Add checksum or pattern if blockchain address
});

// Example: combine for a user registration or profile update
export const userProfileSchema = z.object({
  name: z.string().min(1).max(64),
  email: z.string().email(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  address: z.string().min(5).max(100),
});
