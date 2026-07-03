import { CirclePlus, Plus } from "lucide-react";
import ProjectTask, {
  type ProjectTaskProps,
} from "../../components/ProjectTask";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { getProjectsAPI } from "./getProjectsAPI";
import EmptyProjectPage from "./EmptyProjectPage";
import ProjectSkeleton from "../../components/ProjectSkeleton";
import ErrorProjectPage from "./ErrorProjectPage";

const Projects = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const mutation = useMutation({
    mutationFn: getProjectsAPI,
    onSuccess: (data) => {
      setProjects(data);
      console.log("Projects fetched successfully");
      console.log(data);
    },
    onMutate: () => {
      setLoading(true);
    },
    onError: () => {
      setError(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, []);

  return (
    <>
      {error ? (
        <>
          <ErrorProjectPage />
        </>
      ) : (
        <>
          {loading ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProjectSkeleton key={index} />
                ))}
              </div>
            </>
          ) : (
            <>
              {projects.length > 0 ? (
                <>
                  <div className="relative flex justify-between items-center mb-10">
                    <div>
                      <h1 className="headline-lg">Projects</h1>
                      <p className="body-md text-[#434654]">
                        Manage and curate your projects
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/project/add")}
                      className="fixed bottom-24 right-8 md:absolute md:right-4 md:top-1  rounded-lg md:rounded-none flex justify-center items-center gap-1.5 btn h-10 w-10 md:h-12 w-fit md:p-4 px-4.5 py-7  md:px-6 md:py-3"
                    >
                      <Plus color="#ffffff" size={20} />{" "}
                      <span className="hidden md:block">
                        Create New Project
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 md:mb-8">
                      {projects.map(
                        (project: ProjectTaskProps, index: number) => (
                          <ProjectTask key={index} project={project} />
                        ),
                      )}
                      <div className="h-55 hidden md:flex flex-col justify-center items-center gap-4 rounded-lg shadow-sm">
                        <span onClick={()=>navigate("/project/add")} className="flex items-center justify-center p-3.5 rounded-lg surface-low cursor-pointer">
                          <CirclePlus
                            size={20}
                            color="#000000"
                            absoluteStrokeWidth
                          />
                        </span>
                        <span className="font-bold text-[14px]">ADD PROJECT</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-between px-8 mb-12 md:mb-0 justify-self-end ">
                      <span className="body-md text-[#434654]">
                        Showing 5 of 24 active projects
                      </span>
                      <Pagination
                        currentPage={page}
                        totalPages={2}
                        onPageChange={setPage}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <EmptyProjectPage />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Projects;
