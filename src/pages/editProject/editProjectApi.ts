import {getSession} from "../../utils/getSession";

interface EditProjectPayload {
  name: string;
  description: string;
}

export const editProjectAPI = async (
  data: EditProjectPayload, project_id: string
) => {
  const session = await getSession();
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?id=eq.${project_id}`,
    {
      method: "PATCH",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};