import { AlertCircle, RefreshCw } from "lucide-react";

interface TaskModalErrorProps {
  error: unknown;
  onRetry: () => void;
  onClose: () => void;
}

const TaskModalError = ({ error, onRetry, onClose }: TaskModalErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 p-8 text-center my-4">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-semibold text-red-900 mb-1">
        Failed to load task details
      </h3>
      <p className="text-xs text-red-600 max-w-md mb-6">
        {error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please check your connection and try again."}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="btn inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <RefreshCw size={15} />
          <span>Retry</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskModalError;
