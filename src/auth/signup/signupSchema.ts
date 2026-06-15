import {z} from 'zod'
const signUpSchema = z.object({

name: z
  .string()
  .transform((val) =>
    val.trim().replace(/\s{2,}/g, " ")
  )
  .refine(
    (val) =>
      val.length >= 3 &&
      val.length <= 50 &&
      /^[\p{L}]+(?:\s[\p{L}]+)*$/u.test(val),
    {
      message:
        "Name must be 3–50 characters, letters only, and no extra spaces",
    }
  ),

  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    "Invalid email format"
  ),

  jobTitle: z.string().optional(),
  password: z
  .string()
  .refine(
    (val) =>
      val.length >= 8 &&
      val.length <= 64 &&
      /^\S+$/.test(val) &&
      /[A-Z]/.test(val) &&
      /[a-z]/.test(val) &&
      /[0-9]/.test(val) &&
      /[^A-Za-z0-9]/.test(val),
    {
      message:
        "Password must be 8–64 chars, include upper, lower, number, special char, and no spaces",
    }
  ),

  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export {signUpSchema}