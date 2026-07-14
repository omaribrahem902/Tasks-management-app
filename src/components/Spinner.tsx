const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-6 md:hidden">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    </div>
  );
};

export default Spinner;