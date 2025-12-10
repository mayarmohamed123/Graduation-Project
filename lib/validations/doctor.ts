// lib/validations/doctor.ts
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
export const doctorStage1Schema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  specialty: z
    .string()
    .min(1, "Specialty is required"),
  gender: z.enum(["male", "female"]),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  profilePicture: requiredFileSchema,
});

// Stage 2: Clinic Information
export const doctorStage2Schema = z.object({
  clinicName: z
    .string()
    .min(3, "Clinic name must be at least 3 characters")
    .max(100, "Clinic name must be at most 100 characters"),
  clinicPhoneNumber: z
    .string()
    .min(1, "Clinic phone number is required")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number format"),
  country: z
    .string()
    .min(1, "Country is required"),
  city: z
    .string()
    .min(1, "City is required"),
  street: z
    .string()
    .min(1, "Street address is required"),
  consultationType: z.enum(["inclinic", "homevisit", "both"]),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  clinicImage: requiredFileSchema,
});

// Combined schema for full form
export const doctorRegistrationSchema = doctorStage1Schema.merge(doctorStage2Schema);

// Type exports
export type DoctorStage1FormData = z.infer<typeof doctorStage1Schema>;
export type DoctorStage2FormData = z.infer<typeof doctorStage2Schema>;
export type DoctorRegistrationFormData = z.infer<typeof doctorRegistrationSchema>;
