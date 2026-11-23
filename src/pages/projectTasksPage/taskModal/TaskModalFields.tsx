import { Calendar, ChevronDown, Loader2, UserCheck, X } from "lucide-react";
import type { Member } from "../../members/MembersPage";
import type { epic } from "../../projectEpics/projectEpicsPage/Epic";
import { TASK_STATUS_OPTIONS } from "../../addNewTaskPage/fields";
import { getToday } from "./taskModalUtils";

interface TaskModalFieldsProps {
  currentAssigneeId: string;
  onAssigneeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAssigneePending?: boolean;
  members: Member[];

  status: string;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isStatusPending?: boolean;

  currentDueDateInput: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDueDateClear: () => void;
  isDueDatePending?: boolean;

  reporterName: string;
  formattedCreatedAt: string;

  currentEpicId: string;
  onEpicChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isEpicPending?: boolean;
  epics: epic[];
}

const selectClass =
  "w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 pr-7 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors";

const renderIndicator = (isPending?: boolean) =>
  isPending ? (
    <Loader2 size={14} className="animate-spin text-slate-400" />
  ) : (
    <ChevronDown size={14} className="text-slate-400" />
  );

const TaskModalFields = ({
  currentAssigneeId,
  onAssigneeChange,
  isAssigneePending,
  members,
  status,
  onStatusChange,
  isStatusPending,
  currentDueDateInput,
  onDueDateChange,
  onDueDateClear,
  isDueDatePending,
  reporterName,
  formattedCreatedAt,
  currentEpicId,
  onEpicChange,
  isEpicPending,
  epics,
}: TaskModalFieldsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
          Assignee
        </span>
        <div className="relative">
          <select
            value={currentAssigneeId}
            onChange={onAssigneeChange}
            disabled={isAssigneePending}
            className={selectClass}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.metadata?.name || member.email}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            {renderIndicator(isAssigneePending)}
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
          Status
        </span>
        <div className="relative">
          <select
            value={status}
            onChange={onStatusChange}
            disabled={isStatusPending}
            className={selectClass}
          >
            {TASK_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            {renderIndicator(isStatusPending)}
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
          Due Date
        </span>
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="date"
              value={currentDueDateInput}
              min={getToday()}
              onChange={onDueDateChange}
              disabled={isDueDatePending}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
            />
            {isDueDatePending && (
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 size={14} className="animate-spin text-slate-400" />
              </div>
            )}
          </div>
          {currentDueDateInput && (
            <button
              type="button"
              title="Clear due date"
              onClick={onDueDateClear}
              disabled={isDueDatePending}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
          Created By
        </span>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <UserCheck size={13} />
          </div>
          <span
            className="text-sm font-medium text-slate-800 truncate"
            title={reporterName}
          >
            {reporterName}
          </span>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
          Created At
        </span>
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-800">
            {formattedCreatedAt}
          </span>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-slate-200/80 p-3 bg-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2">
          Related Epic
        </span>
        <div className="relative">
          <select
            value={currentEpicId}
            onChange={onEpicChange}
            disabled={isEpicPending}
            className={selectClass}
          >
            <option value="">None</option>
            {epics.map((ep) => (
              <option key={ep.id} value={ep.id}>
                {ep.epic_id}{" "}
                {ep.title.length > 55 ? `${ep.title.slice(0, 55)}…` : ep.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            {renderIndicator(isEpicPending)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModalFields;
