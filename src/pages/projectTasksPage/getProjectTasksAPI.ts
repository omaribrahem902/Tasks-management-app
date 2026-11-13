import { getSession } from "../../utils/getSession";

type GetTasksByStatusParams = {
  projectId: string;
  stat?: string;
  title?: string;
  search?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
};

export const getProjectTasksByStatus = async ({
  projectId,
  stat,
  title,
  search,
  limit,
  offset = 0,
  signal,
}: GetTasksByStatusParams) => {
  const session = await getSession();

  const params = new URLSearchParams();

  // project_id is always required
  params.set("project_id", `eq.${projectId}`);

  // Leading and trailing whitespace must be removed from the search term
  const searchTerm = (title ?? search)?.trim();

  // Case-insensitive ilike search on title; omit when empty
  if (searchTerm) {
    params.set("title", `ilike.%${searchTerm}%`);
  }

  if (stat) {
    params.set("status", `eq.${stat}`);
  }

  if (limit !== undefined) {
    params.set("limit", String(limit));
    params.set("offset", String(offset));
  }

  params.set("order", "created_at.desc");

  const queryString = params.toString().replace(/\+/g, "%20");

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/project_tasks?${queryString}`,
    {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const tasks = await response.json();
  const contentRange = response.headers.get("content-range");
  const parsedTotal = contentRange ? Number(contentRange.split("/")[1]) : NaN;
  const totalCount = Number.isNaN(parsedTotal) ? 0 : parsedTotal;

  return {
    tasks,
    totalCount,
  };
};
