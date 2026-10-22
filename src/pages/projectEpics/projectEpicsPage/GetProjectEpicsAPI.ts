import { getSession } from "../../../utils/getSession";

type GetEpicsParams = {
  projectId: string;
  limit?: number;
  offset?: number;
};

export const getEpicsAPI = async ({
  projectId,
  limit,
  offset = 0,
}: GetEpicsParams) => {
  const session = await getSession();

  const params = new URLSearchParams({
    project_id: `eq.${projectId}`,
    order: "created_at.desc",
  });

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
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const epics = await response.json();
  const contentRange = response.headers.get("content-range");
  const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

  return {
    epics,
    totalCount,
  };
};
