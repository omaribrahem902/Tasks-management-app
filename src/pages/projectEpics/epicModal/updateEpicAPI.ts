import {getSession} from "../../../utils/getSession";

export interface updateEpicPayload {
  title?: string;
  description?: string;
  assignee_id?: string | null;
  deadline?: string | null;
}



export const updateEpicAPI = async (
  data: updateEpicPayload,
  epic_id: string,
) => {
  const session = await getSession();

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/epics?epic_id=eq.${epic_id}`,
    {
      method: "PATCH",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    const error = await res.text();

    console.error("Update Epic Error:", {
      status: res.status,
      statusText: res.statusText,
      error,
      payload: data,
      epic_id,
    });

    throw new Error(error);

  }

  return res.json();
};