import { useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";

const UserMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
        <div className="primary-container p-2 rounded-lg center-flex text-white w-10 h-10">
          O
        </div>

        <ChevronDown size={18} />
      </button>

      {open && (
        <>
          {/* Overlay لإغلاق القائمة عند الضغط خارجها */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2">
            <button
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-red-50 text-red-600 transition-all"
              onClick={() => {
                logoutMutation.mutate();
                setOpen(false);
              }}
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">
                Logout
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;