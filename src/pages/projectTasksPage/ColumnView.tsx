import { CalendarX, Plus } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import TaskBoardView from "./TaskBoard";
import CardSkeleton from "./CardSkeleton";
import { getProjectTasksByStatus } from "./getProjectTasksAPI";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";
import { useSelectedStatusStore } from "../addNewTaskPage/useTasksStore";
const PAGE_SIZE = 6;

interface ColumnViewProps {
  projectId?: string;
  status?: string;
  title?: string;
  color?: string;
}

const ColumnView = ({ projectId, status, title, color }: ColumnViewProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { setSelectedStatus} = useSelectedStatusStore();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["projectTasks", "board", projectId, status],
    queryFn: ({ pageParam }) =>
      getProjectTasksByStatus({
        projectId: projectId as string,
        stat: status as string,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + (page.tasks?.length ?? 0),
        0,
      );
      if (loaded < (lastPage.totalCount ?? 0)) {
        return loaded;
      }
      return undefined;
    },
    enabled: Boolean(projectId && status),
  });

  const tasks: Task[] = useMemo(() => {
    if (!data?.pages) return [];

    const map = new Map<string, Task>();
    data.pages.forEach((page) => {
      page.tasks?.forEach((task: Task) => {
        if (task.id && !map.has(task.id)) {
          map.set(task.id, task);
        }
      });
    });
    return Array.from(map.values());
  }, [data]);

  const totalCount = data?.pages?.[0]?.totalCount ?? tasks.length;
  const hasTasks = tasks.length > 0;

  // Observer مربوط بحاوية العمود مش الـ viewport
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
      {
        root, // ← مهم: السكرول جوه العمود
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage, tasks.length]);

  const handlePlusClick = () => {
    setSelectedStatus({status})
    if (projectId) navigate(`/project/${projectId}/tasks/new`);
  };

  return (
    <div
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

          {/* Sentinel */}
          <div ref={loadMoreRef} className="h-6 w-full shrink-0" />
        </div>
      ) : (
        <div className="hidden flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#cbd5e1] p-3 text-slate-500 uppercase md:flex">
          <CalendarX strokeWidth={1.5} size={30} />
          <p className="mb-6 text-sm text-slate-400">NO TASKS.</p>
        </div>
      )}
    </div>
  );
};

export default ColumnView;
