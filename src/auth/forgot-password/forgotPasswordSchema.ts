import {z} from 'zod'

const forgotPasswordSchema = z.object({

  email: z.string().refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    "Invalid email format"
  ),
});

export {forgotPasswordSchema}