import { ChevronDown, Plus } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumbs";
import SearchBar from "../../components/SearchBar";

const ProjectTasksHeader = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isListView = searchParams.get("view") === "list";

  const handleViewChange = (selectedView: string) => {
    if (selectedView === "list") {
      navigate(`/project/${projectId}/tasks?view=list`);
    } else {
      navigate(`/project/${projectId}/tasks`);
    }
  };

  const handleAddTask = () => {
    if (projectId) {
      navigate(`/project/${projectId}/tasks/new`);
    }
  };

  return (
    <>
      <Breadcrumb />

      <div className="relative mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="headline-lg">
              {isListView ? (
                <>
                  <span className="hidden md:inline">Project Tasks</span>
                  <span className="md:hidden">Active Workboard</span>
                </>
              ) : (
                "Active Workboard"
              )}
            </h1>
            <p className="hidden md:block text-sm text-[#434654] mt-1">
              Curating Project Alpha's production pipeline and milestones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchBar />

            {/* View Switcher Select (Desktop only) */}
            <div className="relative min-w-[135px] hidden md:block">
              <select
                value={isListView ? "list" : "board"}
                onChange={(e) => handleViewChange(e.target.value)}
                className="w-full appearance-none rounded-sm border border-slate-300 bg-white px-3.5 py-3 pr-8 text-sm font-medium text-slate-700 shadow-xs hover:border-slate-400 focus:border-blue-500 focus:outline-hidden cursor-pointer"
              >
                <option value="board">Board View</option>
                <option value="list">List View</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Desktop Add Task button */}
            <button
              onClick={handleAddTask}
              className="btn hidden md:flex items-center justify-center gap-1.5 px-4 py-3 rounded-sm text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>

            {/* Mobile Add Task button */}
            <button
              onClick={handleAddTask}
              className="flex md:hidden items-center justify-center gap-1 primary-container text-white py-2.5 w-full rounded-sm text-center text-sm font-medium cursor-pointer"
            >
              <Plus size={18} />
              <span>ADD NEW TASK</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTasksHeader;
