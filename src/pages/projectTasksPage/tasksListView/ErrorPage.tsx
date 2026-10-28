interface ErrorPageProps {
  refetch: () => void;
}
export const ErrorPage = ({refetch}: ErrorPageProps) => {
  return (
    <div className="w-full bg-white rounded-md shadow-xs border border-slate-200 p-8 text-center mb-10">
      <p className="text-base font-medium text-slate-800 mb-2">
        Failed to load tasks
      </p>
      <button
        onClick={() => refetch()}
        className="btn px-4 py-2 text-sm rounded-sm cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
};