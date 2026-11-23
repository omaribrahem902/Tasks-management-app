import { Layers } from "lucide-react";
import type { StatusConfig } from "./taskModalUtils";

interface TaskModalTitleProps {
  title: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  statusConfig: StatusConfig;
  epicIdentifier?: string | null;
}

const TaskModalTitle = ({
  title,
  onChange,
  onBlur,
  disabled,
  statusConfig,
  epicIdentifier,
}: TaskModalTitleProps) => {
  return (
    <div>
      <input
        id="task-details-title"
        type="text"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-label="Task title"
        className="w-full text-xl md:text-2xl font-bold text-slate-900 leading-snug bg-transparent border border-transparent rounded-lg px-2 py-1 -mx-2 hover:border-slate-200 focus:border-blue-400 focus:outline-none focus:bg-slate-50/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-slate-400"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: statusConfig.dotColor }}
          />
          {statusConfig.label}
        </span>

        {epicIdentifier && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E0E8FF] px-2.5 py-1 text-xs font-semibold text-[#003D9B]">
            <Layers size={13} />
            <span>{epicIdentifier}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskModalTitle;
