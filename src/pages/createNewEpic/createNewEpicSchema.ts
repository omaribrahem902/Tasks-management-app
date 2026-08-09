import { z } from "zod";
import { descriptionField, titleField } from "../../schemas/fields";

export const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createNewEpicsSchema = z.object({
  name: titleField,

  description: descriptionField,

  assigneeId: z.string().optional(),

  deadline: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;

        return value >= getToday();
      },
      {
        message: "Deadline cannot be in the past",
      }
    ),
});

export type CreateNewEpicFormData = z.infer<
  typeof createNewEpicsSchema
>;