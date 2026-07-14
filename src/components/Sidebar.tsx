import {
  FolderOpen,
  Boxes,
  CheckCheck,
  Users,
  CircleAlert,
  ChevronLeft,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import clsx from "clsx";
import { tasklyIcon } from "../assets/icons";
import { useMutation } from "@tanstack/react-query";
import { logoutAPI } from "../auth/logout/logout";
import {useNavigate} from "react-router-dom";
import { useProjectStore } from "../stores/useProjectStore";

const sidebarLinks = [
  {
    title: "Projects",
    link: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Project Epics",
    link: "/epics",
    icon: Boxes,
  },
  {
    title: "Project Tasks",
    link: "/tasks",
    icon: CheckCheck,
  },
  {
    title: "Project Members",
    link: "/members",
    icon: Users,
  },
  {
    title: "Project Details",
    link: "/details",
    icon: CircleAlert,
  },
];

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({isOpen}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const currentProject = useProjectStore((state) => state.currentProject);

const handleClick = (index: number,link: string) => {
  setSelected(index);
  navigate(`project/${currentProject?.id}${link}`);
};

const logoutMutation = useMutation({
  mutationFn: logoutAPI,
  onSuccess: () => {
    navigate("/login");
  },
});

  return (
    <>
      <aside
        className={clsx(
          " md:relative absolute min-h-screen border-r bg-[#f4f5fb] flex flex-col justify-between transition-all duration-75 z-50",
          collapsed ? "w-[88px]" : "w-[260px]",
          isOpen ? "translate-x-0 " : "-translate-x-full md:translate-x-0",
        )}
      >
        <div>
          <div className="flex items-center p-7 h-21">
            {tasklyIcon}
            <h2
              className={`text-lg font-bold ml-2 ${collapsed ? "hidden" : "block"}`}
            >
              TASKLY
            </h2>
          </div>
          {/* Links */}
          <nav className="p-3">
            <ul className="space-y-2">
              {sidebarLinks.map((link, index) => {
                const Icon = link.icon;

                return (
                  <li key={index}>
                    <button
                      className={clsx(
                        "w-full flex items-center gap-3 rounded-xl px-2 lg:px-4 py-3 transition-all",
                        index === selected
                          ? "bg-white text-blue-700 shadow-sm"
                          : "hover:bg-white/70 text-slate-700",
                        collapsed && "justify-center",
                      )}
                      onClick={() => handleClick(index,link.link)}
                    >
                      <Icon size={20} />

                      {!collapsed && (
                        <span className="font-medium text-sm">
                          {link.title}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/70 transition-all text-slate-700"
          >
            <ChevronLeft
              size={20}
              className={clsx(
                "transition-transform",
                collapsed && "rotate-180",
              )}
            />

            {!collapsed && (
              <span className="font-medium text-sm">Collapse</span>
            )}
          </button>

          <button 
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-50 transition-all text-red-600"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut size={20} />

            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Bottom Mobile Navigation */}
      {!isOpen && (
        <nav className="max-w-screen md:hidden fixed surface-low bottom-0 w-full z-10">
          <ul className="flex justify-center gap-10 py-3.5 px-4">
            {sidebarLinks.map((link, index) => {
              const Icon = link.icon;
              const text = link.title.split(" ")[1] ?? link.title.split(" ")[0];
              return (
                <li key={index}>
                  <button
                    className={clsx(
                      " flex flex-col justify-center items-center gap-1 transition-all",
                      index === selected ? " text-blue-700" : " text-slate-700",
                    )}
                    onClick={() => setSelected(index)}
                  >
                    <Icon size={18} />    
                    <span className="text-[10px] font-semibold">{text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
