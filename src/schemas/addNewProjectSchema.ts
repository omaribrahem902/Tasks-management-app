import {z} from 'zod'
const addNewProjectSchema = z.object({

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
        "Title must be 3–50 characters, letters only, and no extra spaces",
    }
  ),

description: z
  .string()
  .transform((val) =>
    val.trim().replace(/\s{2,}/g, " ")
  )
  .refine(
    (val) =>
      val.length >= 0 &&
      val.length <= 500,
    {
      message:
        "Description must be between 0 and 500 characters",
    }
  ),
});

export {addNewProjectSchema}