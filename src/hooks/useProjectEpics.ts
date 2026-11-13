import { useQuery } from "@tanstack/react-query";
import { getEpicsAPI } from "../pages/projectEpics/projectEpicsPage/GetProjectEpicsAPI";

export const useProjectEpics = (projectId?: string) => {
  return useQuery({
    queryKey: ["epics", projectId],
    queryFn: () => getEpicsAPI({ projectId: projectId! }),
    enabled: !!projectId,
  });
};
