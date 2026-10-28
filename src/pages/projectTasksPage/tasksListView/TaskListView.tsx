import Pagination from "../../../components/Pagination";
import ListViewSkeleton from "./ListViewSkeleton";
import { useSelectedTaskStore } from "../../../stores/useProjectStore";
import { useState } from "react";
import { LIMIT, useProjectTasksDesktop } from "../useProjectTasksDesktop";
import type { ProjectTaskItem } from "./utils";
import { ErrorPage } from "./ErrorPage";
import { EmptyPage } from "./EmptyPage";
import TasksTable from "./TasksTable";


interface TaskListViewProps {
  projectId: string;
}

const TaskListView = ({ projectId }: TaskListViewProps) => {
  const [page, setPage] = useState(1);
  const setSelectedTask = useSelectedTaskStore(
    (state) => state.setSelectedTask,
  );

  const { data, isLoading, isError, refetch } = useProjectTasksDesktop(
    projectId,
    page,
  );

  const tasks: ProjectTaskItem[] = Array.isArray(data)
    ? data
    : (data?.tasks ?? []);

  const totalCount = data?.totalCount ?? 0;

  const totalPages = Math.ceil(totalCount / LIMIT);

  if (isLoading) {
    return <ListViewSkeleton />;
  }

  if (isError) {
    return (
      <ErrorPage refetch={refetch} />
    )
  }

  if (tasks.length === 0) {
    return (
      <EmptyPage projectId={projectId} />
    );
  }

  return (
    <div className="w-full bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden mb-10">
      <TasksTable
        tasks={tasks}
        projectId={projectId}
        setSelectedTask={setSelectedTask}
      />

      {/* Pagination UI */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
        <span className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">{tasks.length}</span> of{" "}
          <span className="font-medium text-slate-700">{data?.totalCount}</span>{" "}
          results
        </span>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default TaskListView;
