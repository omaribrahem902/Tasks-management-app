import { useInfiniteQuery } from "@tanstack/react-query";
import { getEpicsAPI } from "./GetProjectEpicsAPI";
import { LIMIT } from "./useProjectEpicsDesktop";

export const useProjectEpicsMobile = (
  projectId: string | undefined,
) => {
  return useInfiniteQuery({
    queryKey: ["projectEpics", projectId, "infinite"],

    queryFn: ({ pageParam }) =>
      getEpicsAPI(
        {
          projectId: projectId as string,
          limit: LIMIT,
          offset: (pageParam - 1) * LIMIT,
        }
      ),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const loadedPages = allPages.length;

      const totalPages = Math.ceil(
        lastPage.totalCount / LIMIT,
      );

      return loadedPages < totalPages
        ? loadedPages + 1
        : undefined;
    },

    enabled: !!projectId,

    staleTime: 0,
  });
};