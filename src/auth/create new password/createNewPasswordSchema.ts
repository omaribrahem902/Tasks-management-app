import {z} from 'zod'
const createNewPasswordSchema = z.object({
    
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

export {createNewPasswordSchema}