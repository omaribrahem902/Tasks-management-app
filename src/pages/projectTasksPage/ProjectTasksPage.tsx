import { useParams, useSearchParams } from "react-router-dom";
import ColumnView from "./ColumnView";
import ProjectTasksHeader from "./ProjectTasksHeader";
import TaskListView from "./tasksListView/TaskListView";
import MobileTasksList from "./MobileTasksList";
import { TaskModalContainer } from "./taskModal";

const STATUSES = [
  { key: "TO_DO", label: "To Do", color: "#3B82F6" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#EAB308" },
  { key: "BLOCKED", label: "Blocked", color: "#EF4444" },
  { key: "IN_REVIEW", label: "In Review", color: "#A855F7" },
  { key: "READY_FOR_QA", label: "Ready for QA", color: "#14B8A6" },
  { key: "REOPENED", label: "Reopened", color: "#F97316" },
  { key: "READY_FOR_PRODUCTION", label: "Ready for Production", color: "#EC4899" },
  { key: "DONE", label: "Done", color: "#22C55E" },
] as const;

const ProjectTasks = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const isListView = searchParams.get("view") === "list";

  return (
    <>
      <ProjectTasksHeader />

      {isListView ? (
        <>
          {/* Desktop List */}
          <div className="mb-10 hidden md:block">
            <TaskListView projectId={projectId as string} />
          </div>

          {/* Mobile List → قائمة واحدة من كل الـ tasks */}
          {projectId && <MobileTasksList projectId={projectId} />}
        </>
      ) : (
        <>
          {/* Mobile Board → قائمة واحدة (6 من الكل، من غير columns) */}
          {projectId && <MobileTasksList projectId={projectId} />}

          {/* Desktop Board → أعمدة حسب الـ status */}
          <section className="custom-scrollbar mb-0 hidden max-h-[470px] max-w-full flex-1 gap-6 overflow-x-auto overflow-y-auto pb-2 md:flex">
            {STATUSES.map((status) => (
              <ColumnView
                key={status.key}
                projectId={projectId}
                status={status.key}
                title={status.label}
                color={status.color}
              />
            ))}
          </section>
        </>
      )}

      <TaskModalContainer />
    </>
  );
};

export default ProjectTasks;