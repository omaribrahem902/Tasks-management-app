import { Calendar, CircleCheck } from "lucide-react";
import BoxName from "../../components/BoxName";
import type { Task } from "../projectEpics/epicModal/epicTasks/EpicTask";
import { formatDate } from "../../utils/formatDate";
interface TaskBoardViewProps {
  task: Task;
  color?: string;
}

const TaskBoardView = ({ task, color }: TaskBoardViewProps) => {
  return (
    <div
      className="flex w-full md:w-[288px] flex-col gap-4 rounded-md border-l-4 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
      style={{ borderLeftColor: color ?? "#CBD5E1" }}
    >
      <div className="flex justify-between items-center">
        <h3
          className={`${task.status === "DONE" ? `line-through text-slate-400` : ""}`}
        >
          {task.title}
        </h3>
        <span style={{backgroundColor: color}} className="text-white px-2 py-1 text-[10px] rounded-sm">{task.status}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span className="flex items-center gap-1 capitalize">
          {task.status === "DONE" ? (
            <>
              <CircleCheck strokeWidth={1.5} size={14} color="#004E32" />
              <span className="uppercase text-[#004E32]">Completed</span>
            </>
          ) : (
            <>
              <Calendar size={14} />
              {formatDate(task.due_date)}
            </>
          )}
        </span>
        <BoxName size={8} name={task.assignee.name} fontTheme="text-[10px]" />
      </div>
    </div>
  );
};

export default TaskBoardView;
