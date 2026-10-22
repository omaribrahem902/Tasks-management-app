import { Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EmptyEpicPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center lg:gap-11 gap-8">
      <img src="/Empty_epics_page.png" alt="No epics available" />
      <div className="text-center">
        <h1 className="title-md font-bold md:headline-lg mb-4">No epics in this project yet.</h1>
        <p className="w-fit md:w-[434px] body-md md:title-md slate-4 wrap-break-word">
          Break down your large project into manageable epics to track progress
          better and maintain architectural clarity.
        </p>
      </div>
      <button
        onClick={() => navigate(`/project/${projectId}/epics/new`)}
        className="  rounded-lg md:rounded-none flex justify-center items-center gap-1.5 btn px-4 py-4 md:px-6 md:py-3 mb-16 md:mb-0"
      >
        <Zap size={16} color="#ffffff" strokeWidth={2} />
        <span className="">Create First Epic</span>
      </button>
      <img className="hidden md:block" src="/Empty_epics_photos.png" alt="No epics available" />
    </div>
  );
};

export default EmptyEpicPage;
