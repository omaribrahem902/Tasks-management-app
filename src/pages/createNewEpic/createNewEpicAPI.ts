import { getSession } from "../../utils/getSession";

interface CreateNewEpicPayload {
  title: string;
  description: string;
  assigneeId?: string;
  projectId: string;
  deadline?: string;
}

export const createNewEpicAPI = async (
  data: CreateNewEpicPayload
) => {
  const session = await getSession();

const body = {
  title: data.title,
  description: data.description,
  assignee_id: data.assigneeId || null,
  project_id: data.projectId,
  deadline: data.deadline || null,
};

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/epics`,
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

  return res.json();
};