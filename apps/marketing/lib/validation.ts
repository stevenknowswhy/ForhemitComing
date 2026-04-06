import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone number must be 10 digits")
  .optional()
  .or(z.literal(""));

export const contactFormSchema = z.object({
  contactType: z.enum([
    "business-owner",
    "partner", 
    "existing-business",
    "website-visitor",
    "marketing"
  ]),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(200).optional(),
  interest: z.enum([
    "esop-transition",
    "accounting",
    "legal",
    "lending",
    "broker",
    "wealth",
    "appraisal",
    "career",
    "general"
  ]).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

export const earlyAccessSchema = z.object({
  email: emailSchema,
});

export const jobApplicationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: emailSchema,
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  position: z.string().min(1),
  otherPosition: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type EarlyAccessData = z.infer<typeof earlyAccessSchema>;
export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
