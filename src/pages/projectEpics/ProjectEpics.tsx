import { Calendar, ChevronDown, List, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import ErrorPage from "../ErrorPage";
import type { EpicProps } from "../../components/Epic";
import { getEpicsAPI } from "./ProjectEpicsAPI";
import Breadcrumb from "../../components/BreadCrumbs";
import Epic from "../../components/Epic";
import SearchBar from "../../components/SearchBar";
import EmptyEpicPage from "./EmptyEpicsPage";
import EpicsPageSkeleton from "./EpicsPageSkeleton";
import Modal from "../../components/EpicModal";
import BoxName from "../../components/BoxName";
import { formatDate } from "../../utils/formatDate";

const LIMIT = 6;

const ProjectEpics = () => {
  const [selectedEpic, setSelectedEpic] = useState<EpicProps | null>(null);
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
    mutationFn: ({
      projectId,
      limit,
      offset,
    }: {
      projectId: string;
      limit: number;
      offset: number;
    }) => getEpicsAPI(projectId, limit, offset),

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
    return <EpicsPageSkeleton />;
  }

  if (loading && isMobile && epics.length === 0) {
    return <Spinner />;
  }

  if (!loading && epics.length === 0) {
    return <EmptyEpicPage />;
  }
  console.log("Rendering ProjectEpics with epics:", epics);
  return (
    <>
      <Breadcrumb />
      <div className=" relative mb-10 flex items-center justify-between">
        <div className="flex flex-1 justify-between items-center">
          <h1 className="hidden md:block headline-lg ">Project Epics</h1>
          <SearchBar />
        </div>

        <button
          onClick={() => navigate(`/project/${projectId}/epics/new`)}
          className="btn fixed bottom-24 right-8 flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-4.5 py-7 md:absolute md:right-4 md:-top-1 md:h-12 md:rounded-none md:p-4 md:px-6 md:py-3"
        >
          <Plus color="#fff" size={20} />
          <span className="hidden md:block"> New Epic</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-16 grid gap-6 md:mb-8 lg:grid-cols-2">
          {epics.map((epic) => (
            <Epic
              key={epic.epic_id}
              epic={epic}
              onClick={() => setSelectedEpic(epic)}
            />
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
      {selectedEpic && (
        <Modal
          selectedEpicId={selectedEpic.epic_id}
          isOpen={true}
          onClose={() => setSelectedEpic(null)}
        >
          <>
            <h2 className="w-full p-3 border rounded-xl mb-4">
              {selectedEpic.title}
            </h2>
            <div className="w-full h-37.5 p-3 border rounded-xl mb-4 ">
              {selectedEpic.description}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 mb-2">
              {/* start created by */}
              <div className="flex flex-col items-start ">
                <span className="text-[#737685] text-[11px] mr-1 mb-2">
                  CREATED BY
                </span>
                <div className="flex items-center">
                  <BoxName
                    name={selectedEpic.created_by.name}
                    size={8}
                    fontTheme="label-sm"
                  />
                  <span className="ml-2.5 body-md">
                    {selectedEpic.created_by.name}
                  </span>
                </div>
              </div>
              {/* end created by */}
              {/* start assignee */}
              <div className="flex flex-col items-start ">
                <span className="text-[#737685] text-[11px] mr-1 mb-2">
                  ASSIGNEE
                </span>
                <div className="flex items-center border rounded-lg p-2">
                  <BoxName
                    name={selectedEpic.assignee.name}
                    size={6}
                    fontTheme="label-sm"
                  />
                  <span className="ml-2.5 body-md">
                    {selectedEpic.assignee.name}
                  </span>
                </div>
              </div>
              {/* end assignee */}
              {/* start deadline */}
              <div className="flex flex-col items-start ">
                <span className="text-[#737685] text-[11px] mr-1 mb-2">
                  DEADLINE
                </span>
                <div className="flex items-center border rounded-lg p-2">
                  <Calendar size={16} color="#000000" strokeWidth={1} />
                  <span className="ml-2.5 body-md">
                    {selectedEpic.deadline}
                  </span>
                </div>
              </div>
              {/* end deadline */}
              {/* start created at */}
            <div className="flex flex-col items-start mb-2">
              <span className="text-[#737685] text-[11px] mr-1">
                CREATED AT
              </span>
              <div className="flex items-center border rounded-lg p-2">
                <Calendar size={16} color="#000000" strokeWidth={1} />
                <span className="ml-2.5 body-md">
                  {formatDate(selectedEpic.created_at)}
                </span>
              </div>
            </div>
            {/* end created at */}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <span className="flex items-center gap-1 primary">
                  <Plus size={16} /> Add Task
                </span>
              </div>
              <div className="flex flex-col items-center justify-center w-full bg-[#F1F3FF] border-2 border-dashed rounded-lg p-6">
                <div className="w-fit h-fit bg-[#D7E2FF] flex items-center justify-center mb-4 p-4 rounded-lg">
                  <List size={16} color="#041B3C4D" />
                </div>
                <p className="text-[16px] mb-4">No tasks have been added to this epic yet</p>
                <button
                  onClick={() => navigate(`/`)}
                  className="btn flex w-fit items-center justify-center gap-1.5 px-6 py-2.5"
                >
                  <Plus color="#fff" size={20} />
                  <span className="hidden md:block"> Add Task</span>
                </button>
              </div>
            </div>
          </>
        </Modal>
      )}
    </>
  );
};

export default ProjectEpics;
