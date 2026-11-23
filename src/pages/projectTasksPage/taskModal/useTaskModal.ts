import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useProjectEpics } from "../../../hooks/useProjectEpics";
import { useProjectMembers } from "../../../hooks/useProjectMembers";
import type { Member } from "../../members/MembersPage";
import type { epic } from "../../projectEpics/projectEpicsPage/Epic";
import {
  getTaskDetails,
  updateTaskDetailsAPI,
  type ProjectTaskDetail,
  type TaskUpdatePayload,
} from "./taskModalAPI";
import { formatTaskDate, getStatusConfig, getToday } from "./taskModalUtils";

export interface UseTaskModalProps {
  taskId?: string | null;
  projectId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const useTaskModal = ({
  taskId,
  projectId,
  isOpen,
  onClose,
}: UseTaskModalProps) => {
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const queryClient = useQueryClient();

  const [pendingFields, setPendingFields] = useState<Record<string, boolean>>({});
  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const [localDescription, setLocalDescription] = useState<string | null>(null);

  const [lastSeenTaskId, setLastSeenTaskId] = useState<string | null | undefined>(taskId);
  if (taskId !== lastSeenTaskId) {
    setLastSeenTaskId(taskId);
    setPendingFields({});
    setLocalTitle(null);
    setLocalDescription(null);
  }

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
        if (
          triggerElementRef.current &&
          typeof triggerElementRef.current.focus === "function"
        ) {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuery<ProjectTaskDetail[]>({
      queryKey: ["taskDetails", projectId, taskId],
      queryFn: () => getTaskDetails(projectId as string, taskId as string),
      enabled: Boolean(isOpen && projectId && taskId),
      staleTime: 1000 * 30,
    });

  const { data: rawMembers = [] } = useProjectMembers(projectId!);
  const members = rawMembers as Member[];

  const { data: epicsData } = useProjectEpics(projectId!);
  const epics = (epicsData?.epics ?? []) as epic[];

  const handleUpdateField = useCallback(
    async (
      fieldName: string,
      payload: TaskUpdatePayload,
      optimisticExtras?: Partial<ProjectTaskDetail>
    ) => {
      if (!taskId || !projectId) return;

      const snapshot = queryClient.getQueryData<ProjectTaskDetail[]>([
        "taskDetails",
        projectId,
        taskId,
      ]);

      setPendingFields((prev) => ({ ...prev, [fieldName]: true }));

      queryClient.setQueryData<ProjectTaskDetail[]>(
        ["taskDetails", projectId, taskId],
        (old) => {
          if (!old || old.length === 0) return old;
          return [{ ...old[0], ...payload, ...(optimisticExtras ?? {}) }];
        }
      );

      try {
        await updateTaskDetailsAPI(taskId, payload);
        toast.success("Task updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
        queryClient.invalidateQueries({ queryKey: ["epicTasks"] });
      } catch {
        queryClient.setQueryData(["taskDetails", projectId, taskId], snapshot);
        toast.error("Failed to update task. Please try again.");
      } finally {
        setPendingFields((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [taskId, projectId, queryClient]
  );

  const rawTask = Array.isArray(data) && data.length > 0 ? data[0] : null;
  const isCurrentData = rawTask && rawTask.id === taskId;
  const showLoading = isLoading || (isFetching && !isCurrentData);
  const task = isCurrentData ? rawTask : null;
  const isEmpty =
    Array.isArray(data) && data.length === 0 && !showLoading && !isError;

  const reporterName =
    task?.reporter ||
    task?.reporter_name ||
    (typeof task?.created_by === "object"
      ? task?.created_by?.name
      : task?.created_by) ||
    "—";

  const statusConfig = getStatusConfig(task?.status);
  const currentAssigneeId = task?.assignee?.id ?? "";
  const currentEpicId = task?.epic_id ?? task?.epic?.id ?? "";

  const currentDueDateInput = task?.due_date
    ? (task.due_date.includes("T")
        ? task.due_date.split("T")[0]
        : task.due_date.split(" ")[0])
    : "";

  const epicIdentifier = task?.epic?.epic_id || task?.epic?.title || null;

  const displayTitle = localTitle !== null ? localTitle : (task?.title ?? "");
  const displayDescription =
    localDescription !== null ? localDescription : (task?.description ?? "");

  const handleTitleBlur = () => {
    if (!task) return;
    const newTitle = displayTitle.trim();

    if (!newTitle) {
      toast.error("Title cannot be empty.");
      setLocalTitle(null);
      return;
    }
    if (newTitle === task.title) {
      setLocalTitle(null);
      return;
    }

    setLocalTitle(null);
    handleUpdateField("title", { title: newTitle });
  };

  const handleDescriptionBlur = () => {
    if (!task) return;
    const normalized = displayDescription.trim() || null;
    const prevNormalized = task.description?.trim() || null;

    setLocalDescription(null);
    if (normalized === prevNormalized) return;

    handleUpdateField("description", { description: normalized });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    const newAssigneeId = e.target.value || null;
    const prevAssigneeId = task?.assignee?.id ?? null;
    if (newAssigneeId === prevAssigneeId) return;

    const member = members.find((m: Member) => m.user_id === newAssigneeId);
    const optimisticExtras: Partial<ProjectTaskDetail> = {
      assignee: newAssigneeId
        ? {
            id: newAssigneeId,
            name: member?.metadata?.name || member?.email || null,
            avatar: null,
            email: member?.email || null,
          }
        : null,
      assignee_name: member?.metadata?.name || member?.email || null,
    };

    handleUpdateField("assignee", { assignee_id: newAssigneeId }, optimisticExtras);
  };

  const handleEpicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    const newEpicId = e.target.value || null;
    const prevEpicId = task?.epic_id ?? task?.epic?.id ?? null;
    if (newEpicId === prevEpicId) return;

    const selectedEpic = epics.find((ep: epic) => ep.id === newEpicId);
    const optimisticExtras: Partial<ProjectTaskDetail> = {
      epic_id: newEpicId,
      epic: newEpicId && selectedEpic
        ? { id: selectedEpic.id, epic_id: selectedEpic.epic_id, title: selectedEpic.title }
        : null,
    };

    handleUpdateField("epic", { epic_id: newEpicId }, optimisticExtras);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task) return;
    const newDate = e.target.value;
    if (newDate === currentDueDateInput) return;

    if (newDate && newDate < getToday()) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    handleUpdateField("due_date", { due_date: newDate || null });
  };

  const handleDueDateClear = () => {
    if (!task || !currentDueDateInput) return;
    handleUpdateField("due_date", { due_date: null });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    const newStatus = e.target.value;
    if (newStatus === task.status) return;
    handleUpdateField("status", { status: newStatus });
  };

  const formattedCreatedAt = formatTaskDate(task?.created_at);

  return {
    task,
    showLoading,
    isError,
    error,
    isEmpty,
    refetch,
    displayTitle,
    displayDescription,
    setLocalTitle,
    setLocalDescription,
    statusConfig,
    epicIdentifier,
    currentAssigneeId,
    currentEpicId,
    currentDueDateInput,
    reporterName,
    formattedCreatedAt,
    pendingFields,
    members,
    epics,
    handleTitleBlur,
    handleDescriptionBlur,
    handleAssigneeChange,
    handleEpicChange,
    handleDueDateChange,
    handleDueDateClear,
    handleStatusChange,
  };
};
