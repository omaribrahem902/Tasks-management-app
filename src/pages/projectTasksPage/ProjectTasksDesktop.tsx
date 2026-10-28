// import { useState } from "react";

// import Pagination from "../../components/Pagination";
// import ErrorPage from "../ErrorPage";

// import { LIMIT, useProjectTasksDesktop } from "./useProjectTasksDesktop";
// import EmptyEpicPage from "../projectEpics/projectEpicsPage/EmptyEpicsPage";

// interface ProjectTasksDesktopProps {
//   projectId: string;
// }

// const ProjectTasksDesktop = ({
//   projectId,
// }: ProjectTasksDesktopProps) => {
//   const [page, setPage] = useState(1);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//   } = useProjectTasksDesktop(
//     projectId,
//     page,
//     stat
//   );

//   if (isError) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <ErrorPage />
//       </div>
//     );
//   }

//   if (isLoading || isFetching) {
//     return <></>;
//   }

//   const tasks = data?.tasks ?? [];
//   const totalCount = data?.totalCount ?? 0;

//   const totalPages = Math.ceil(
//     totalCount / LIMIT,
//   );

//   if (tasks.length === 0) {
//     return <EmptyEpicPage />;
//   }

//   return (
//     <div className="flex flex-1 flex-col justify-between">
//       {/* <ProjectEpicsList epics={epics} /> */}

//       <div className="hidden items-center justify-between px-8 md:flex">
//         <span className="body-md text-[#434654]">
//           Showing {tasks.length} of {totalCount} active
//           tasks
//         </span>

//         <Pagination
//           currentPage={page}
//           totalPages={totalPages}
//           onPageChange={setPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProjectTasksDesktop;