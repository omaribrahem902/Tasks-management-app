interface TaskModalDescriptionProps {
  description: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
}

const TaskModalDescription = ({
  description,
  onChange,
  onBlur,
  disabled,
}: TaskModalDescriptionProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#737685] mb-2">
        Description
      </span>
      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder="No description provided."
        rows={4}
        className="w-full resize-none bg-transparent text-sm text-slate-700 leading-relaxed placeholder:italic placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white rounded-md px-2 py-1 -mx-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  );
};

export default TaskModalDescription;
