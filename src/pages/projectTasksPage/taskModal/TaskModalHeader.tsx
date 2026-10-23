import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TaskModalHeaderProps {
  taskId?: string;
  onClose: () => void;
}

const TaskModalHeader = ({ taskId, onClose }: TaskModalHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const displayTaskId = taskId
    ? taskId.length > 8
      ? `TASK-${taskId.slice(0, 4).toUpperCase()}`
      : taskId
    : "TASK DETAILS";

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      if (taskId) {
        url.searchParams.set("taskId", taskId);
      }
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      toast.success("Task link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
      {/* Task identifier badge */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0E8FF] text-[#003D9B]">
          <img
            src="/EpicDetailsIcon.png"
            alt=""
            className="h-4 w-4 object-contain"
            onError={(e) => {
              // fallback if image fails
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          />
        </div>
        <span className="font-mono text-xs font-semibold tracking-wide text-[#041B3C99]">
          {displayTaskId}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          title="Copy Link"
        >
          {copied ? (
            <Check size={14} className="text-emerald-600" />
          ) : (
            <Copy size={14} className="text-slate-400" />
          )}
          <span>{copied ? "Copied" : "Copy Link"}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskModalHeader;
