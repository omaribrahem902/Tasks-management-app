import {z} from 'zod'

const loginSchema = z.object({

  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    "Invalid email format"
  ),

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
});

export {loginSchema}