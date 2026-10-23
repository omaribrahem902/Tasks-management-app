import { useParams } from "react-router-dom";
import BoxName from "../../../../components/BoxName";
import { formatDate } from "../../../../utils/formatDate";
import { useSelectedTaskStore } from "../../../../stores/useProjectStore";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  assignee: {
    name: string;
  };
  due_date: string;
  status: string;
}

const EpicTask = ({ task }: { task: Task }) => {
  const { projectId: paramsProjectId } = useParams<{ projectId: string }>();
 const setSelectedTask = useSelectedTaskStore((state) => state.setSelectedTask);

  const finalProjectId = paramsProjectId || task.project_id;

const handleClick = () => {
    if (task.id && finalProjectId) {
      setSelectedTask({
        taskId: task.id,
        projectId: finalProjectId,
      });
    } 
  };
  return (
    <>
      <li onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }} className="flex flex-row items-center  p-4">
        <div>
          <h2 className="text-[16px] mb-1">{task.title}</h2>
          <div className="flex items-center gap-1">
            <BoxName
              name={task.assignee.name? task.assignee.name : ""}
              size={6}
              fontTheme="text-[8px] font-bold"
            />
            <span className="text-[12px] text-[#041B3C66] ">{task.assignee.name ? task.assignee.name : "Unassigned"}</span>
          </div>
        </div>
        <div className="flex flex-col ml-auto items-end">
          <span className="  label-sm text-[#041B3C66]/90">DUE DATE</span>
          <span className="text-[12px]">{formatDate(task.due_date)}</span>
        </div>
      </li>
      <hr />
    </>
  );
};

export default EpicTask;
