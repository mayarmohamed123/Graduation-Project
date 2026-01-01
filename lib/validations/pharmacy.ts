// lib/validations/pharmacy.ts
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Required file validation helper
const requiredFileSchema = z
  .instanceof(File, { message: "Image is required" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "File size must be less than 5MB"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported"
  );

// Stage 1: Personal/Account Information
export const pharmacyStage1Schema = z.object({
  userName: z
    .string()
    .min(2, "User name must be at least 2 characters")
    .max(50, "User name must be at most 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  profilePicture: requiredFileSchema,
});

// Stage 2: Pharmacy Information
export const pharmacyStage2Schema = z.object({
  pharmacyName: z
    .string()
    .min(3, "Pharmacy name must be at least 3 characters")
    .max(100, "Pharmacy name must be at most 100 characters"),
  pharmacistPhoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number format"),
  licenseNumber: z
    .string()
    .min(1, "License number is required"),
  country: z
    .string()
    .min(1, "Country is required"),
  city: z
    .string()
    .min(1, "City is required"),
  street: z
    .string()
    .min(1, "Street address is required"),
  pharmacyImage: requiredFileSchema,
});

// Combined schema for full form
export const pharmacyRegistrationSchema = pharmacyStage1Schema.merge(pharmacyStage2Schema);

// Type exports
export type PharmacyStage1FormData = z.infer<typeof pharmacyStage1Schema>;
export type PharmacyStage2FormData = z.infer<typeof pharmacyStage2Schema>;
export type PharmacyRegistrationFormData = z.infer<typeof pharmacyRegistrationSchema>;
