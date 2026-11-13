import { CalendarX, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import TaskBoardView from "./TaskBoard";
import CardSkeleton from "./CardSkeleton";
import { getProjectTasksByStatus } from "./getProjectTasksAPI";
import { updateTaskStatusAPI } from "./updateTaskStatusAPI";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";
import { useSelectedStatusStore } from "../addNewTaskPage/useTasksStore";

const PAGE_SIZE = 6;

interface ColumnViewProps {
  projectId?: string;
  status?: string;
  title?: string;
  color?: string;
  searchTerm?: string;
}

type BoardPage = { tasks: Task[]; totalCount: number };
type InfiniteTasksData = {
  pages: BoardPage[];
  pageParams: number[];
};

const ColumnView = ({
  projectId,
  status,
  title,
  color,
  searchTerm = "",
}: ColumnViewProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const { setSelectedStatus } = useSelectedStatusStore();

  const trimmedSearch = searchTerm.trim();
  const queryKey = [
    "projectTasks",
    "board",
    projectId,
    status,
    trimmedSearch,
  ] as const;

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, signal }) =>
      getProjectTasksByStatus({
        projectId: projectId as string,
        stat: status as string,
        title: trimmedSearch,
        limit: PAGE_SIZE,
        offset: pageParam,
        signal,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + (page.tasks?.length ?? 0),
        0,
      );
      if (loaded < (lastPage.totalCount ?? 0)) return loaded;
      return undefined;
    },
    enabled: Boolean(projectId && status),
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

  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const hasTasks = tasks.length > 0;

  // ---- Optimistic move between columns ----
  const moveTaskOptimistically = useCallback(
    async (task: Task, fromStatus: string, toStatus: string) => {
      if (!projectId || fromStatus === toStatus) return;

      const fromKey = [
        "projectTasks",
        "board",
        projectId,
        fromStatus,
        trimmedSearch,
      ];
      const toKey = [
        "projectTasks",
        "board",
        projectId,
        toStatus,
        trimmedSearch,
      ];

      // Snapshot for rollback
      const previousFrom = queryClient.getQueryData(fromKey);
      const previousTo = queryClient.getQueryData(toKey);

      const updatedTask: Task = { ...task, status: toStatus };

      // Remove from old column
      queryClient.setQueryData<InfiniteTasksData>(fromKey, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: BoardPage) => ({
            ...page,
            tasks: page.tasks.filter((t) => t.id !== task.id),
            totalCount: Math.max(0, (page.totalCount ?? 1) - 1),
          })),
        };
      });

      // Add to new column (first page)
      queryClient.setQueryData<InfiniteTasksData>(toKey, (old) => {
        if (!old?.pages?.length) {
          return {
            pages: [{ tasks: [updatedTask], totalCount: 1 }],
            pageParams: [0],
          };
        }
        return {
          ...old,
          pages: old.pages.map((page: BoardPage, index: number) =>
            index === 0
              ? {
                  ...page,
                  tasks: [
                    updatedTask,
                    ...page.tasks.filter((t) => t.id !== task.id),
                  ],
                  totalCount: (page.totalCount ?? page.tasks.length) + 1,
                }
              : page,
          ),
        };
      });

      try {
        await updateTaskStatusAPI(task.id, toStatus);
        queryClient.invalidateQueries({
          queryKey: ["projectTasks"],
          exact: false,
        });
      } catch {
        // Rollback
        queryClient.setQueryData(fromKey, previousFrom);
        queryClient.setQueryData(toKey, previousTo);
      }
    },
    [projectId, queryClient, trimmedSearch],
  );

  // ---- Drop target ----
  useEffect(() => {
    const el = columnRef.current;
    if (!el || !status) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ type: "column", status }),
      canDrop: ({ source }) =>
        source.data.type === "task" && source.data.fromStatus !== status,
      onDrop: ({ source }) => {
        const { task, fromStatus } = source.data as {
          task: Task;
          fromStatus: string;
        };
        if (task && fromStatus) {
          moveTaskOptimistically(task, fromStatus, status);
        }
      },
    });
  }, [status, moveTaskOptimistically]);

  // ---- Infinite scroll ----
  useEffect(() => {
    const root = scrollRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading
        ) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "100px", threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage, tasks.length]);

  const handlePlusClick = () => {
    setSelectedStatus({ status: status || "" });
    if (projectId) navigate(`/project/${projectId}/tasks/new`);
  };

  return (
    <div
      ref={columnRef}
      className={`${
        hasTasks || isLoading ? "flex" : "hidden md:flex"
      } mb-4 w-full min-w-[288px] shrink-0 flex-col gap-4 md:w-[288px]`}
    >
      {/* Header */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="flex items-center">
          <div
            style={{ backgroundColor: color }}
            className="h-2 w-2 rounded-full"
          />
          <span className="ml-2 text-sm font-medium">{title}</span>
          <span className="ml-2 bg-[#E0E8FF] px-2 py-1 text-xs">
            {isLoading ? "..." : totalCount}
          </span>
        </div>
        <Plus
          size={12}
          className="ml-auto cursor-pointer"
          onClick={handlePlusClick}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="hidden flex-col gap-3 md:flex">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <div className="hidden flex-col items-center justify-center gap-2 rounded-md border border-dashed border-red-200 p-4 text-xs text-red-500 md:flex">
          <span>Failed to load tasks</span>
          <button
            onClick={() => refetch()}
            className="rounded bg-red-50 px-3 py-1 text-red-600 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : hasTasks ? (
        <div
          ref={scrollRef}
          className="flex max-h-[470px] flex-col gap-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {tasks.map((task) => (
            <TaskBoardView
              key={task.id}
              task={task}
              color={color}
              projectId={projectId}
            />
          ))}

          {isFetchingNextPage && (
            <div className="flex flex-col gap-3">
              <CardSkeleton />
            </div>
          )}

          <div ref={loadMoreRef} className="h-6 w-full shrink-0" />
        </div>
      ) : (
        <div className="hidden min-h-[120px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#cbd5e1] p-3 text-slate-500 uppercase md:flex">
          <CalendarX strokeWidth={1.5} size={30} />
          <p className="mb-6 text-sm text-slate-400">NO TASKS.</p>
        </div>
      )}
    </div>
  );
};

export default ColumnView;
