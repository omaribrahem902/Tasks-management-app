import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateEpicAPI } from "./updateEpicAPI";
import type { updateEpicPayload } from "./updateEpicAPI";

export const useUpdateEpic = (
  projectId: string,
  epicId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: updateEpicPayload) =>
      updateEpicAPI(payload, epicId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["epicDetails", projectId, epicId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["projectEpics", projectId],
      });
    },
  });
};
