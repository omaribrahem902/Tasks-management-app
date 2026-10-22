import { useQuery } from "@tanstack/react-query";
import { getEpicsAPI } from "./GetProjectEpicsAPI";

export const LIMIT = 6;

export const useProjectEpicsDesktop = (
  projectId: string | undefined,
  page: number,
) => {
  return useQuery({
    queryKey: ["projectEpics", projectId, page],

    queryFn: () =>
      getEpicsAPI({
        projectId: projectId as string,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      }),

    enabled: !!projectId,

    staleTime: 0,
  });
};