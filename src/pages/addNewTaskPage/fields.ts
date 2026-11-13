import { z } from "zod";
import type { FormFieldConfig } from "../../components/ResuableForm/types";
import type { Member } from "../members/MembersPage";
import type { epic } from "../projectEpics/projectEpicsPage/Epic";

export interface TaskFormValues {
  title: string;
  status: string;
  assignee_id?: string;
  epic_id?: string;
  due_date?: string;
  description?: string;
}

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  status: z.string().min(1, "Status is required"),
  assignee_id: z.string().optional(),
  epic_id: z.string().optional(),
  due_date: z.string().optional(),
  description: z.string().optional(),
});

export const TASK_STATUS_OPTIONS = [
  { label: "TO DO", value: "TO_DO" },
  { label: "IN PROGRESS", value: "IN_PROGRESS" },
  { label: "BLOCKED", value: "BLOCKED" },
  { label: "IN_REVIEW", value: "IN_REVIEW" },
  { label: "READY_FOR_QA", value: "READY_FOR_QA" },
  { label: "REOPENED", value: "REOPENED" },
  { label: "READY_FOR_PRODUCTION", value: "READY_FOR_PRODUCTION" },
  { label: "DONE", value: "DONE" },
];

export const getTaskFormFields = (
  members: Member[] = [],
  epics: epic[] = []
): FormFieldConfig<TaskFormValues>[] => [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "e.g., Finalize structural schematics",
    colSpan: 2,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    placeholder: "Select Status",
    options: TASK_STATUS_OPTIONS,
  },
  {
    name: "assignee_id",
    label: "Assignee",
    type: "select",
    placeholder: "Select Team Member",
    options: members.map((member) => ({
      label: member.metadata?.name || member.email,
      value: member.user_id,
    })),
  },
  {
    name: "epic_id",
    label: "Epic",
    type: "select",
    placeholder: "Select Epic Link",
    colSpan: 2,
    options: epics.map((epic) => ({
      label: `${epic.epic_id} ${
        epic.title.length > 100
          ? `${epic.title.slice(0, 100)}...`
          : epic.title
      }`,
      value: epic.id,
    })),
  },
  {
    name: "due_date",
    label: "Due Date",
    type: "date",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Provide detailed context for this task...",
    colSpan: 2,
  },
];
