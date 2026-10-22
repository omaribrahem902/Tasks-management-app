import { getSession } from "../../utils/getSession";

export const getProjectTasks = async (project_id: string, status?: string) => {
  const session = await getSession();

  let url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/project_tasks?project_id=eq.${project_id}`;

  if (status) {
    // If status is passed with spaces, normalize to match the PostgreSQL enum
    const formattedStatus = status.replace(/ /g, "_");
    url += `&status=eq.${encodeURIComponent(formattedStatus)}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_API_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};
