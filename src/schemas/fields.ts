import { z } from "zod";

export const titleField = z
  .string()
  .transform((val) => val.trim().replace(/\s{2,}/g, " "))
  .refine(
    (val) =>
      val.length >= 3 &&
      val.length <= 50 &&
      /^[\p{L}]+(?:\s[\p{L}]+)*$/u.test(val),
    {
      message:
        "Title must be 3–50 characters, letters only, and no extra spaces",
    }
  );

export const descriptionField = z
  .string()
  .transform((val) => val.trim().replace(/\s{2,}/g, " "))
  .refine(
    (val) =>
      val.length <= 500,
    {
      message:
        "Description must be between 0 and 500 characters",
    }
  );

