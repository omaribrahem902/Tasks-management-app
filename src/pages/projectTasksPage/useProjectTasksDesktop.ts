import { useQuery } from "@tanstack/react-query";
import { getProjectTasksByStatus } from "./getProjectTasksAPI";

export const LIMIT = 6;

export const useProjectTasksDesktop = (
  projectId: string | undefined,
  page: number,
  stat?: string,
  search?: string,
) => {
  const trimmedSearch = search?.trim() || "";

  return useQuery({
    queryKey: ["projectTasks", "desktop", projectId, page, stat, trimmedSearch],

    queryFn: ({ signal }) =>
      getProjectTasksByStatus({
        projectId: projectId as string,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        stat,
        title: trimmedSearch,
        signal,
      }),

    enabled: !!projectId,

    staleTime: 0,
  });
};
