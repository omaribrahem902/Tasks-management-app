import {
  Menu,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAppSelector } from "../stores/hooks";
import { useMutation } from "@tanstack/react-query";
import { logoutAPI } from "../auth/logout/logout";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  openSidebar: () => void;
}

const Navbar = ({
  openSidebar,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
const logoutMutation = useMutation({
  mutationFn: logoutAPI,
  onSuccess: () => {
    navigate("/login");
  },
});

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const {
    data,
    loading,
  } = useAppSelector(
    (state) => state.user
  );

  const name =
    data?.user_metadata?.name ??
    "User";

  const jobTitle =
    data?.user_metadata?.job_title ??
    "";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <nav className="flex justify-between lg:justify-end items-center px-6 md:px-10 py-3 bg-white md:bg-[#F1F3FF]">
      <div className="flex lg:hidden items-center gap-4">
        <Menu
          size={24}
          strokeWidth={2.5}
          className="cursor-pointer"
          onClick={openSidebar}
        />

        <h2>Taskly</h2>
      </div>

      <div
        ref={dropdownRef}
        className="relative flex items-center"
      >
        <div className="hidden md:flex flex-col items-end">
          <p className="body-md">
            {loading
              ? "Loading..."
              : name}
          </p>

          <p className="body-md primary">
            {jobTitle}
          </p>
        </div>

        <button
          onClick={() =>
            setIsOpen((prev) => !prev)
          }
          className="ml-4 primary-container rounded-lg w-10 h-10 center-flex text-white font-semibold"
        >
          {initials}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-14 w-56 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 transition-colors">
              <User size={18} />
              My Profile
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 transition-colors">
              <Settings size={18} />
              Settings
            </button>

            <div className="h-px bg-slate-200" />

            <button
              onClick={()=>logoutMutation.mutate()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;