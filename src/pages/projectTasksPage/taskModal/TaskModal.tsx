import TaskModalHeader from "./TaskModalHeader";
import TaskModalSkeleton from "./TaskModalSkeleton";
import TaskModalError from "./TaskModalError";
import TaskModalEmpty from "./TaskModalEmpty";
import TaskModalTitle from "./TaskModalTitle";
import TaskModalDescription from "./TaskModalDescription";
import TaskModalFields from "./TaskModalFields";
import { useTaskModal, type UseTaskModalProps } from "./useTaskModal";

export type TaskModalProps = UseTaskModalProps;

const TaskModal = ({ taskId, projectId, isOpen, onClose }: TaskModalProps) => {
  const {
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
  } = useTaskModal({ taskId, projectId, isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-y-auto rounded-xl bg-white p-6 md:p-8 shadow-2xl custom-scrollbar border border-slate-100"
      >
        <TaskModalHeader taskId={taskId || undefined} onClose={onClose} />

        {showLoading && <TaskModalSkeleton />}

        {!showLoading && isError && (
          <TaskModalError error={error} onRetry={refetch} onClose={onClose} />
        )}

        {!showLoading && !isError && isEmpty && (
          <TaskModalEmpty onClose={onClose} />
        )}

        {!showLoading && !isError && task && (
          <div className="flex flex-col gap-6">
            <TaskModalTitle
              title={displayTitle}
              onChange={setLocalTitle}
              onBlur={handleTitleBlur}
              disabled={pendingFields["title"]}
              statusConfig={statusConfig}
              epicIdentifier={epicIdentifier}
            />

            <TaskModalDescription
              description={displayDescription}
              onChange={setLocalDescription}
              onBlur={handleDescriptionBlur}
              disabled={pendingFields["description"]}
            />

            <TaskModalFields
              currentAssigneeId={currentAssigneeId}
              onAssigneeChange={handleAssigneeChange}
              isAssigneePending={pendingFields["assignee"]}
              members={members}
              status={task.status}
              onStatusChange={handleStatusChange}
              isStatusPending={pendingFields["status"]}
              currentDueDateInput={currentDueDateInput}
              onDueDateChange={handleDueDateChange}
              onDueDateClear={handleDueDateClear}
              isDueDatePending={pendingFields["due_date"]}
              reporterName={reporterName}
              formattedCreatedAt={formattedCreatedAt}
              currentEpicId={currentEpicId}
              onEpicChange={handleEpicChange}
              isEpicPending={pendingFields["epic"]}
              epics={epics}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
