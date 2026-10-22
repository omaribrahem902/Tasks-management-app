import { useParams, useSearchParams } from "react-router-dom";
import ColumnView from "./ColumnView";
import ProjectTasksHeader from "./ProjectTasksHeader";
import TaskListView from "./TaskListView";

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
          {/* Desktop: Table list view */}
          <div className="hidden md:block">
            <TaskListView projectId={projectId as string} />
          </div>

          {/* Mobile: Board view fallback */}
          <section className="flex flex-col md:hidden flex-1 mb-10">
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
      ) : (
        <section className="flex flex-col md:flex-row md:max-h-[470px] md:max-w-full flex-1 md:gap-6 md:overflow-x-auto md:overflow-y-auto mb-10 md:mb-0 custom-scrollbar pb-2">
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
      )}
    </>
  );
};

export default ProjectTasks;