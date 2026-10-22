import { CirclePlus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import Pagination from "../../components/Pagination";
import ProjectSkeleton from "./ProjectSkeleton";
import ProjectTask, { type ProjectTaskProps } from "./ProjectTask";
import EmptyProjectPage from "./EmptyProjectPage";
import ErrorPage from "../ErrorPage";
import { getProjectsAPI } from "./getProjectsAPI";

const LIMIT = 6;

const Projects = () => {
  const navigate = useNavigate();

  // ====================== Responsive ======================
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ====================== Desktop page state ======================
  const [page, setPage] = useState(1);

  // ====================== Desktop Query (Pagination) ======================
  const desktopQuery = useQuery({
    queryKey: ["projects", "desktop", page],
    queryFn: () => getProjectsAPI(LIMIT, (page - 1) * LIMIT),
    enabled: !isMobile,                    // يشتغل بس على الديسكتوب
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    staleTime: 1000 * 60 * 2,
  });

  // ====================== Mobile Query (Infinite Scroll) ======================
  const mobileQuery = useInfiniteQuery({
    queryKey: ["projects", "mobile"],
    queryFn: ({ pageParam = 1 }) =>
      getProjectsAPI(LIMIT, (pageParam - 1) * LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.totalCount / LIMIT);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    enabled: isMobile,                     // يشتغل بس على الموبايل
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    staleTime: 1000 * 60 * 2,
  });

  // ====================== Derived Data ======================
  const isLoading = isMobile
    ? mobileQuery.isLoading
    : desktopQuery.isLoading;

  const isFetching = isMobile
    ? mobileQuery.isFetching
    : desktopQuery.isFetching;

  const isError = isMobile ? mobileQuery.isError : desktopQuery.isError;
  const error = isMobile ? mobileQuery.error : desktopQuery.error;

  // المشاريع اللي هتتعرض
  const projects: ProjectTaskProps[] = useMemo(() => {
    if (isMobile) {
      // نجمع كل الصفحات في array واحد
      return mobileQuery.data?.pages.flatMap((p) => p.projects) ?? [];
    }
    return desktopQuery.data?.projects ?? [];
  }, [isMobile, mobileQuery.data, desktopQuery.data]);

  const totalCount = isMobile
    ? mobileQuery.data?.pages[0]?.totalCount ?? 0
    : desktopQuery.data?.totalCount ?? 0;

  const totalPages = useMemo(
    () => Math.ceil(totalCount / LIMIT),
    [totalCount]
  );

  const hasMore = isMobile ? !!mobileQuery.hasNextPage : page < totalPages;

  // ====================== Infinite Scroll Observer ======================
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          mobileQuery.hasNextPage &&
          !mobileQuery.isFetchingNextPage
        ) {
          mobileQuery.fetchNextPage();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [
    isMobile,
    mobileQuery.hasNextPage,
    mobileQuery.isFetchingNextPage,
    mobileQuery.fetchNextPage,
    mobileQuery,
  ]);

  // ====================== Reset page عند تغيير الـ device ======================
  useEffect(() => {
    setPage(1);
  }, [isMobile]);

  // ====================== Early returns ======================
  if (isError) {
    console.error("Error fetching projects:", error);
    return (
      <div className="h-full flex justify-center items-center">
        <ErrorPage />
      </div>
    );
  }

  // أول تحميل → Skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: LIMIT }).map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  // مفيش مشاريع
  if (!isFetching && projects.length === 0) {
    return <EmptyProjectPage />;
  }

  // ====================== UI ======================
  return (
    <>
      {/* Header */}
      <div className="relative mb-10 flex items-center justify-between">
        <div>
          <h1 className="headline-lg">Projects</h1>
          <p className="body-md text-[#434654]">
            Manage and curate your projects
          </p>
        </div>

        <button
          onClick={() => navigate("/project/add")}
          className="btn fixed bottom-24 right-8 flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-4.5 py-7 md:absolute md:right-4 md:top-1 md:h-12 md:rounded-none md:p-4 md:px-6 md:py-3"
        >
          <Plus color="#fff" size={20} />
          <span className="hidden md:block">Create New Project</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-16 grid gap-6 md:mb-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectTask key={project.id} project={project} />
          ))}

          {/* Add Project card (Desktop only) */}
          {!isMobile && projects.length < LIMIT && (
            <div className="hidden h-55 flex-col items-center justify-center gap-4 rounded-lg shadow-sm md:flex">
              <span
                onClick={() => navigate("/project/add")}
                className="surface-low flex cursor-pointer items-center justify-center rounded-lg p-3.5"
              >
                <CirclePlus size={20} absoluteStrokeWidth />
              </span>
              <span className="text-[14px] font-bold">ADD PROJECT</span>
            </div>
          )}

          {/* Skeletons أثناء تحميل الصفحة التالية على الموبايل */}
          {isMobile && mobileQuery.isFetchingNextPage && (
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <ProjectSkeleton key={`loading-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* Desktop Pagination */}
        <div className="hidden items-center justify-between px-8 md:flex">
          <span className="body-md text-[#434654]">
            Showing {projects.length} of {totalCount} active projects
          </span>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* Infinite scroll trigger (Mobile) */}
        {isMobile && hasMore && (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>
    </>
  );
};

export default Projects;