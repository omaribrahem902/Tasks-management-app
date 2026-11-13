import { useState } from "react";

import Pagination from "../../../components/Pagination";
import ErrorPage from "../../ErrorPage";
import EmptyEpicPage from "./EmptyEpicsPage";
import EpicsPageSkeleton from "./EpicsPageSkeleton";

import ProjectEpicsList from "./ProjectEpicsList";
import { LIMIT, useProjectEpicsDesktop } from "./useProjectEpicsDesktop";

interface ProjectEpicsDesktopProps {
  projectId: string;
  searchTerm?: string;
}

const ProjectEpicsDesktop = ({
  projectId,
  searchTerm = "",
}: ProjectEpicsDesktopProps) => {
  const [page, setPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(searchTerm);

  if (prevSearch !== searchTerm) {
    setPrevSearch(searchTerm);
    setPage(1);
  }

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useProjectEpicsDesktop(
    projectId,
    page,
    searchTerm,
  );

  const isSearchActive = Boolean(searchTerm.trim());

  if (isError) {
    if (isSearchActive) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <p className="title-md font-semibold text-red-500">
            Failed to search epics
          </p>
        </div>
      );
    }
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorPage />
      </div>
    );
  }

  if (isLoading || isFetching) {
    return <EpicsPageSkeleton />;
  }

  const epics = data?.epics ?? [];
  const totalCount = data?.totalCount ?? 0;

  const totalPages = Math.ceil(
    totalCount / LIMIT,
  );

  if (epics.length === 0) {
    if (isSearchActive) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <p className="title-md font-semibold text-slate-600">
            No epics found matching your search
          </p>
        </div>
      );
    }
    return <EmptyEpicPage />;
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      <ProjectEpicsList epics={epics} />

      <div className="hidden items-center justify-between px-8 md:flex">
        <span className="body-md text-[#434654]">
          Showing {epics.length} of {totalCount} active epics
        </span>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ProjectEpicsDesktop;