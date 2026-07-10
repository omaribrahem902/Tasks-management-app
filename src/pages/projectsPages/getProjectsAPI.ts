import { getSession } from "../../utils/getSession";

export const getProjectsAPI = async (limit: number, offset: number ) => {
  const session = await getSession();
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
    {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const projects = await response.json();

  const contentRange = response.headers.get("Content-Range");

  const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

  return {
    projects,
    totalCount,
  };
};
