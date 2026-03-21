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
