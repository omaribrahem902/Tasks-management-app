import { useQuery } from "@tanstack/react-query";
import { getEpicsAPI } from "./GetProjectEpicsAPI";

export const LIMIT = 6;

export const useProjectEpicsDesktop = (
  projectId: string | undefined,
  page: number,
  search?: string,
) => {
  const trimmedSearch = search?.trim() || "";

  return useQuery({
    queryKey: ["projectEpics", projectId, page, trimmedSearch],

    queryFn: ({ signal }) =>
      getEpicsAPI({
        projectId: projectId as string,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        search: trimmedSearch,
        signal,
      }),

    enabled: !!projectId,

    staleTime: 0,
  });
};