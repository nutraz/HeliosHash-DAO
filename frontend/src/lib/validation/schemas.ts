import { z } from 'zod';

// Password validation schema
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Registration schema
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: PasswordSchema,
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// KYC schema
export const KycSchema = z.object({
  name: z.string().min(2).max(100),
  aadhaar: z.string().regex(/^\d{12}$/)
});
