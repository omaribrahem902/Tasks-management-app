import { SearchX } from "lucide-react";

interface TaskModalEmptyProps {
  onClose: () => void;
}

const TaskModalEmpty = ({ onClose }: TaskModalEmptyProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center my-4">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/60 text-slate-500">
        <SearchX size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        Task not found
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The requested task could not be found or may have been deleted from this project.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};

export default TaskModalEmpty;
