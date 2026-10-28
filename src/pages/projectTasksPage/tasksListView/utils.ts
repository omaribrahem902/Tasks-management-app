export interface ProjectTaskItem {
  id: string;
  task_id?: string;
  title: string;
  status: string;
  due_date: string | null;
  assignee?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  created_at?: string;
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  TO_DO: { label: "To Do", color: "#3B82F6", bg: "bg-blue-50" },
  IN_PROGRESS: { label: "In Progress", color: "#EAB308", bg: "bg-amber-50" },
  BLOCKED: { label: "Blocked", color: "#EF4444", bg: "bg-red-50" },
  IN_REVIEW: { label: "In Review", color: "#A855F7", bg: "bg-purple-50" },
  READY_FOR_QA: { label: "Ready for QA", color: "#14B8A6", bg: "bg-teal-50" },
  REOPENED: { label: "Reopened", color: "#F97316", bg: "bg-orange-50" },
  READY_FOR_PRODUCTION: {
    label: "Ready for Production",
    color: "#EC4899",
    bg: "bg-pink-50",
  },
  DONE: { label: "Done", color: "#22C55E", bg: "bg-emerald-50" },
};
