import { getSession } from "../../../utils/getSession";

export interface ProjectTaskDetail {
  id: string;
  project_id: string;
  epic_id?: string | null;
  epic?: { id?: string; epic_id?: string; title?: string } | null;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  assignee_name?: string | null;
  assignee_avatar?: string | null;
  assignee?: {
    id?: string | null;
    name?: string | null;
    avatar?: string | null;
    email?: string | null;
  } | null;
  reporter?: string | null;
  created_by?: { name?: string; id?: string } | string | null;
  reporter_name?: string | null;
  due_date?: string | null;
  created_at?: string | null;
  [key: string]: any;
}

export const getTaskDetails = async (
  projectId: string,
  taskId: string
): Promise<ProjectTaskDetail[]> => {
  const session = await getSession();

  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/project_tasks?project_id=eq.${encodeURIComponent(
    projectId
  )}&id=eq.${encodeURIComponent(taskId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_API_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    let parsedMessage = errorText;
    try {
      const parsed = JSON.parse(errorText);
      parsedMessage = parsed.message || parsed.hint || errorText;
    } catch {
      // not JSON
    }
    throw new Error(parsedMessage || "Failed to load task details");
  }

  return res.json();
};
