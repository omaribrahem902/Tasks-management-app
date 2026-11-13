import { getSession } from "../../../utils/getSession";

type GetEpicsParams = {
  projectId: string;
  limit?: number;
  offset?: number;
  search?: string;
  signal?: AbortSignal;
};

export const getEpicsAPI = async ({
  projectId,
  limit,
  offset = 0,
  search,
  signal,
}: GetEpicsParams) => {
  const session = await getSession();

  const params = new URLSearchParams({
    project_id: `eq.${projectId}`,
    order: "created_at.desc",
  });

  if (search && search.trim()) {
    params.set("title", `ilike.%${search.trim()}%`);
  }

  if (limit !== undefined) {
    params.set("limit", String(limit));
    params.set("offset", String(offset));
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/project_epics?${params.toString()}`,
    {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const epics = await response.json();
  const contentRange = response.headers.get("content-range");
  const parsedTotal = contentRange ? Number(contentRange.split("/")[1]) : NaN;
  const totalCount = Number.isNaN(parsedTotal) ? 0 : parsedTotal;

  return {
    epics,
    totalCount,
  };
};
