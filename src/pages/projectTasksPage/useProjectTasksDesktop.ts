import { useQuery } from "@tanstack/react-query";
import { getProjectTasksByStatus } from "./getProjectTasksAPI";

export const LIMIT = 6;

export const useProjectTasksDesktop = (
  projectId: string | undefined,
  page: number,
  stat?: string,
) => {
  return useQuery({
    queryKey: ["projectTasks", projectId, page,stat],

    queryFn: () =>
      getProjectTasksByStatus({
        projectId: projectId as string,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        stat: stat,
      }),

    enabled: !!projectId,

    staleTime: 0,
  });
};