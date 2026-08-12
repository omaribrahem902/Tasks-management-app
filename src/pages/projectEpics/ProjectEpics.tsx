import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import ProjectSkeleton from "../../components/ProjectSkeleton";

import EmptyProjectPage from "../projectsPages/EmptyProjectPage";
import ErrorPage from "../ErrorPage";
import type { EpicProps } from "../../components/Epic";
import { getEpicsAPI } from "./ProjectEpicsAPI";
import Breadcrumb from "../../components/BreadCrumbs";
import Epic from "../../components/Epic";

const LIMIT = 6;

const ProjectEpics = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

  const isMobile = useMemo(
    () => window.matchMedia("(max-width: 767px)").matches,
    [],
  );

  const [page, setPage] = useState(1);
  const [epics, setEpics] = useState<EpicProps[]>([]);
  const [data, setData] = useState({
    epics: [] as EpicProps[],
    totalCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showedProjects, setShowedProjects] = useState(0);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const totalPages = useMemo(
    () => Math.ceil(data.totalCount / LIMIT),
    [data.totalCount],
  );

  const mutation = useMutation({
    mutationFn: ({ projectId, limit, offset }: { projectId: string; limit: number; offset: number }) =>
      getEpicsAPI(projectId, limit, offset),

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: (response) => {
      console.log("Fetched epics:", response.epics);
      setEpics((prev) => {
        if (!isMobile) {
          return response.epics;
        }

        const existingIds = new Set(prev.map((epic) => epic.epic_id));

        const newEpics = response.epics.filter(
          (epic: EpicProps) => !existingIds.has(epic.epic_id),
        );

        return [...prev, ...newEpics];
      });

      setData(response);

      const visibleEpics = Math.min(response.epics.length, LIMIT);

      setShowedProjects(visibleEpics);
      
    },

    onError: () => {
      setError(true);
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const fetchProjects = useCallback(() => {
    mutation.mutate({
      projectId: projectId as string,
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    });
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.5,
      },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isMobile, loading, page, totalPages]);

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <ErrorPage />
      </div>
    );
  }

  if (loading && !isMobile) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: LIMIT }).map((_, index) => (
          <ProjectSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (loading && isMobile && epics.length === 0) {
    return <Spinner />;
  }

  if (!loading && epics.length === 0) {
    return <EmptyProjectPage />;
  }
  return (
    <>
        <Breadcrumb />
        <div className=" relative mb-10 flex items-center justify-between">
          <h1 className="headline-lg">Project Epics</h1>
          <button
            onClick={() => navigate(`/project/${projectId}/epics/new`)}
            className="btn fixed bottom-24 right-8 flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-4.5 py-7 md:absolute md:right-4 md:top-1 md:h-12 md:rounded-none md:p-4 md:px-6 md:py-3"
          >
            <Plus color="#fff" size={20} />
            <span className="hidden md:block"> New Epic</span>
          </button>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-16 grid gap-6 md:mb-8 lg:grid-cols-2">
          {epics.map((epic) => (
            <Epic key={epic.epic_id} epic={epic} />
          ))}

        </div>

        {loading && isMobile && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}

        <div className="hidden items-center justify-between px-8 md:flex">
          <span className="body-md text-[#434654]">
            Showing {showedProjects} of {data.totalCount} active projects
          </span>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {isMobile && page < totalPages && (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>
    </>
  )
}

export default ProjectEpics