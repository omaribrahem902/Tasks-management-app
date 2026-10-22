import {
  useEffect,
  useRef,
} from "react";

import Spinner from "../../../components/Spinner";
import ErrorPage from "../../ErrorPage";
import EmptyEpicPage from "./EmptyEpicsPage";

import ProjectEpicsList from "./ProjectEpicsList";
import { useProjectEpicsMobile } from "./useProjectEpicsMobile";

interface ProjectEpicsMobileProps {
  projectId: string;
}

const ProjectEpicsMobile = ({
  projectId,
}: ProjectEpicsMobileProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useProjectEpicsMobile(projectId);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetchingNextPage &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  ]);

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorPage />
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  const epics =
    data?.pages.flatMap(
      (page) => page.epics,
    ) ?? [];

  if (epics.length === 0) {
    return <EmptyEpicPage />;
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      <ProjectEpicsList epics={epics} />

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-10"
        />
      )}
    </div>
  );
};

export default ProjectEpicsMobile;