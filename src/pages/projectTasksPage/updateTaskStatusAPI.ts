import { getSession } from "../../utils/getSession";

export const updateTaskStatusAPI = async (
  taskId: string,
  status: string
) => {
  const session = await getSession();

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}`,
    {
      method: "PATCH",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};