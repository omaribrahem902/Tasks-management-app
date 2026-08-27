import { X } from "lucide-react";

interface ModalProps {
  selectedEpicId: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({
  selectedEpicId,
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-full rounded-sm bg-white p-2 shadow-2xl md:p-4"
      >
        <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
                <img src="/EpicDetailsIcon.png" alt="" />
                <span className="ml-2.5 body-md text-[#041B3C99] ">{selectedEpicId}</span>
            </div>
            <div className="flex items-center">
                <img src="/CopyLinkIcon.png" alt="" />
                <span className="ml-2.5 body-md text-[#041B3C99] ">Copy Link</span>
                <button
                onClick={onClose}
                className="ml-5 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors duration-200"
                >
                <X size={20} />
                </button>
            </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;