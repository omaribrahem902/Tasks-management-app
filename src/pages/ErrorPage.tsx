const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-11">
      <img
        src="../../public/Error_Project_Page.png"
        alt="No projects available"
      />
      <div className="text-center">
        <h1 className="headline-lg mb-4">Something went wrong </h1>
        <p className="w-fit md:w-[434px] title-md slate-4 wrap-break-word">
          We're having trouble retrieving your projects right now. Please try
          again in a moment.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="  rounded-lg md:rounded-none flex justify-center items-center gap-1.5 btn px-4 py-4 md:px-6 md:py-3 mb-16 md:mb-0"
      >
        Retry Connection
      </button>
    </div>
  );
};

export default ErrorPage;
