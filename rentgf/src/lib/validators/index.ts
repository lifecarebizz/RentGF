import { z } from "zod";

export const registerCustomerSchema = z.object({
  fullName: z.string().min(2).max(100),
  displayName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string().refine((val) => {
    const dob = new Date(val);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      return age >= 18;
    }
    return age >= 18;
  }, { message: "Must be 18 years or older" }),
  country: z.string().optional(),
  city: z.string().optional(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const updateCustomerProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  displayName: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  bio: z.string().max(2000).optional(),
  avatarUrl: z.string().url().optional(),
});

export const companionOnboardingSchema = z.object({
  city: z.string().optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  bio: z.string().max(2000).optional(),
  startingPrice: z.number().min(0).optional(),
  availabilityDays: z.array(z.string()).optional(),
  availabilityTimes: z.array(z.string()).optional(),
  unavailabilityPeriods: z.any().optional(),
});

export const bookingCreateSchema = z.object({
  companionId: z.string(),
  bookingDate: z.string(),
  startTime: z.string(),
  durationMinutes: z.number().min(15).max(480),
  activityType: z.string().optional(),
  message: z.string().max(2000).optional(),
  discountCode: z.string().optional(),
});

export const reviewCreateSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(5000).optional(),
});

export const reportCreateSchema = z.object({
  reportedUserId: z.string(),
  category: z.enum(["HARASSMENT", "SCAM_FRAUD", "INAPPROPRIATE_BEHAVIOR", "SAFETY_CONCERN", "RULE_VIOLATION", "OTHER"]),
  description: z.string().max(5000).optional(),
});

export const replySchema = z.object({
  content: z.string().min(1).max(10000),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  interest: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  verified: z.boolean().optional(),
  available: z.boolean().optional(),
  sort: z.enum(["RECOMMENDED", "NEWEST", "PRICE_ASC", "PRICE_DESC", "RATING"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});
