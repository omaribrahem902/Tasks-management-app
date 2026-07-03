import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="hidden md:flex items-center gap-2 flex-wrap uppercase tracking-wider">
      <Link to="/" className="text-gray-400 font-semibold">
        Home
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

        const isLast = index === pathnames.length - 1;

        const label = segment.replace(/-/g, " ");

        return (
          <div key={routeTo} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />

            {isLast ? (
              <span className="text-blue-700 font-bold">{label}</span>
            ) : (
              <Link to={routeTo} className="text-gray-400 font-semibold">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
