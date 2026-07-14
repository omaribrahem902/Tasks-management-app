import { CirclePlus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import ProjectSkeleton from "../../components/ProjectSkeleton";
import ProjectTask, {type ProjectTaskProps,} from "../../components/ProjectTask";

import EmptyProjectPage from "./EmptyProjectPage";
import ErrorProjectPage from "./ErrorProjectPage";
import { getProjectsAPI } from "./getProjectsAPI";

const LIMIT = 6;

const Projects = () => {
  const navigate = useNavigate();

  const isMobile = useMemo(
    () => window.matchMedia("(max-width: 767px)").matches,
    [],
  );

  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState<ProjectTaskProps[]>([]);
  const [data, setData] = useState({
    projects: [] as ProjectTaskProps[],
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
    mutationFn: ({ limit, offset }: { limit: number; offset: number }) =>
      getProjectsAPI(limit, offset),

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: (response) => {
      setProjects((prev) => {
        if (!isMobile) {
          return response.projects;
        }

        const existingIds = new Set(prev.map((project) => project.id));

        const newProjects = response.projects.filter(
          (project: ProjectTaskProps) => !existingIds.has(project.id),
        );

        return [...prev, ...newProjects];
      });

      setData(response);

      const visibleProjects = Math.min(response.projects.length, LIMIT);

      setShowedProjects(visibleProjects);
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
    return <ErrorProjectPage />;
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

  if (loading && isMobile && projects.length === 0) {
    return <Spinner />;
  }

  if (!loading && projects.length === 0) {
    return <EmptyProjectPage />;
  }

  return (
    <>
      <div className=" relative mb-10 flex items-center justify-between">
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

      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-16 grid gap-6 md:mb-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectTask key={project.id} project={project} />
          ))}

          {data.projects.length < LIMIT && (
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
  );
};

export default Projects;
