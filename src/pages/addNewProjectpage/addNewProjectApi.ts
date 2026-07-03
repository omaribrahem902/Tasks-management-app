import { supabase } from "../../supabase-client";

interface AddNewProjectPayload {
  name: string;
  description: string;
}

export const addNewProjectAPI = async (
  data: AddNewProjectPayload
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects`,
    {
      method: "POST",
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