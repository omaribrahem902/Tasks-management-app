import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../pages/members/getMembersAPI";

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getMembers(projectId),
    enabled: !!projectId,
  });
};