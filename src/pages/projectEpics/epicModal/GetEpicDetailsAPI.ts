import {getSession} from "../../../utils/getSession";

export const getEpicDetails = async (project_id: string, epic_id: string) => {
  const session = await getSession();
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/project_epics?project_id=eq.${project_id}&epic_id=eq.${epic_id}`,
    {
      method: "GET",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};
