import { z } from "zod";

const roleSchema = z.enum(["student", "owner", "admin"]);

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    password: z.string().min(8).max(100),
    role: roleSchema,
    phone: z.string().trim().max(30).optional()
  })
  .superRefine((input, ctx) => {
    if (input.role === "student" && !input.email.endsWith("@my.sliit.lk")) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Students must register with a @my.sliit.lk email."
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

const strongPassword = z
  .string()
  .min(8)
  .max(100)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/,
    "Password must include uppercase, lowercase, number and special character."
  );

export const studentRegisterSchema = z.object({
  firstName: z.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/),
  lastName: z.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/),
  email: z.string().trim().email().regex(/^[a-z]+\d+@my\.sliit\.lk$/),
  phoneNumber: z.string().trim().regex(/^07\d{8}$/),
  emergencyContact: z.string().trim().regex(/^07\d{8}$/),
  address: z.string().trim().min(5).max(200),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.number().int().min(16).max(120),
  password: strongPassword
});

export const ownerRegisterSchema = z.object({
  firstName: z.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/),
  lastName: z.string().trim().min(2).max(30).regex(/^[A-Za-z]+$/),
  email: z.string().trim().email(),
  phoneNumber: z.string().trim().regex(/^07\d{8}$/),
  address: z.string().trim().min(5).max(200),
  gender: z.enum(["Male", "Female", "Other"]),
  password: strongPassword
});

export const roleLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  role: z.enum(["student", "owner", "admin"])
});

export const otpEmailSchema = z.object({
  email: z.string().trim().email()
});

export const otpVerifySchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().trim().regex(/^\d{6}$/)
});
