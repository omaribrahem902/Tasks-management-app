import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import TaskBoardView from "./TaskBoard";
import CardSkeleton from "./CardSkeleton";
import { getProjectTasksByStatus } from "./getProjectTasksAPI";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";

const PAGE_SIZE = 6;

interface MobileTasksListProps {
  projectId: string;
}

const MobileTasksList = ({ projectId }: MobileTasksListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["projectTasks", "mobile", projectId],
    queryFn: ({ pageParam }) =>
      getProjectTasksByStatus({
        projectId,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + (page.tasks?.length ?? 0),
        0
      );
      if (loaded < (lastPage.totalCount ?? 0)) return loaded;
      return undefined;
    },
    enabled: Boolean(projectId),
  });

  const tasks: Task[] = useMemo(() => {
    if (!data?.pages) return [];
    const map = new Map<string, Task>();
    data.pages.forEach((page) => {
      page.tasks?.forEach((task: Task) => {
        if (task.id && !map.has(task.id)) map.set(task.id, task);
      });
    });
    return Array.from(map.values());
  }, [data]);

  useEffect(() => {
    const root = scrollRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "120px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, tasks.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4 md:hidden">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 p-6 text-sm text-red-500 md:hidden">
        Failed to load tasks
        <button onClick={() => refetch()} className="rounded bg-red-50 px-3 py-1">
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-slate-400 md:hidden">
        No tasks.
      </p>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto p-4 mb-10 md:mb-0 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tasks.map((task) => (
        <TaskBoardView
          key={task.id}
          task={task}
          color={task.status} // أو map حسب task.status
          projectId={projectId}
        />
      ))}

      {isFetchingNextPage && <CardSkeleton />}
      {hasNextPage && <div ref={loadMoreRef} className="h-6 shrink-0" />}
    </div>
  );
};

export default MobileTasksList;