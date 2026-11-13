import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addNewTaskAPI } from "./addNewTaskAPI";
import type { TaskFormValues } from "./fields";

export const useCreateTask = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskFormValues) =>
      addNewTaskAPI({ ...data, project_id: projectId as string }),

    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      queryClient.invalidateQueries({ queryKey: ["epicTasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to create task. Please try again.");
    },
  });
};
