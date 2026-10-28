import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface EmptyPageProps {
  projectId: string;
}
export const EmptyPage = ({ projectId }: EmptyPageProps) => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[60vh] bg-white rounded-md shadow-xs border border-slate-200 p-12 text-center mb-10">
      <p className="text-base font-medium text-slate-700 mb-1">
        No tasks found
      </p>
      <p className="text-sm text-slate-400 mb-6">
        There are no tasks for this project yet.
      </p>
      <button
        onClick={() => navigate(`/project/${projectId}/tasks/new`)}
        className="btn inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm cursor-pointer"
      >
        <Plus size={16} />
        <span>Add New Task</span>
      </button>
    </div>
  );
};