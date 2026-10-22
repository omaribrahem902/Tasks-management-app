import { getSession } from "../../utils/getSession";

export interface addNewTaskPayload {
  project_id: string;
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status?: string;
}

export const addNewTaskAPI = async (
  data: addNewTaskPayload
) => {
  const session = await getSession();
  console.log("Add New Task Payload:", data);
const body = {
  project_id: data.project_id,
  epic_id: data.epic_id || null,
  title: data.title,
  description: data.description || null,
  assignee_id: data.assignee_id || null,
  due_date: data.due_date || null,
  status: data.status || null,
};

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/tasks`,
    {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    }
  );

 if (!res.ok) {
  const error = await res.text();

  throw new Error(error);
}
  console.log("Add New Task Response:", {
    status: res.status,
    statusText: res.statusText,
    payload: body,
  });
  return res.json();
};