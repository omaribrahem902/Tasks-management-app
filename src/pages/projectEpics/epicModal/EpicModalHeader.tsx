import { X } from "lucide-react";

interface EpicModalHeaderProps {
  epicId: string;
  onClose: () => void;
}

const EpicModalHeader = ({ epicId, onClose }: EpicModalHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/EpicDetailsIcon.png" alt="" />

        <span className="ml-2.5 body-md text-[#041B3C99]">{epicId}</span>
      </div>

      <div className="flex items-center">
        <img src="/CopyLinkIcon.png" alt="" />

        <span className="ml-2.5 body-md text-[#041B3C99]">Copy Link</span>

        <button
          onClick={onClose}
          className="ml-5 cursor-pointer text-slate-500 transition-colors duration-200 hover:text-slate-900"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default EpicModalHeader;
