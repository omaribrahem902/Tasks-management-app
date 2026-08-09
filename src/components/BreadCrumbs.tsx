import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useProjectStore } from "../stores/useProjectStore";

const Breadcrumb = () => {
  const location = useLocation();

  const currentProject = useProjectStore(
    (state) => state.currentProject
  );

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <div className="flex items-center gap-2">
      {pathnames.map((segment, index) => {
        const routeTo =
          "/" + pathnames.slice(0, index + 1).join("/");

        const isLast =
          index === pathnames.length - 1;

        const isProjectId =
          pathnames[index - 1] === "project";

        const label = isProjectId
          ? currentProject?.name ?? "Project"
          : segment.replace(/-/g, " ");

        return (
          <div
            key={routeTo}
            className="flex items-center gap-2"
          >
            {isLast ? (
              <span className="font-bold capitalize text-blue-700">
                {label}
              </span>
            ) : (
              <>
                <Link
                  to={routeTo}
                  className="font-semibold capitalize text-gray-400"
                >
                  {label}
                </Link>

                <ChevronRight
                  size={16}
                  className="text-gray-400"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;