import { CirclePlus, Plus } from "lucide-react"
import ProjectTask from "../components/ProjectTask"
import Pagination from "../components/Pagination"
import { useState } from "react";

const Projects = () => {
  const [page, setPage] = useState(1);
  return (
<>
      <div className="relative flex justify-between items-center mb-10">
        <div>
          <h1 className="headline-lg">Projects</h1>
          <p className="body-md text-[#434654]">Manage and curate your projects</p>
        </div>
        <button className="fixed bottom-24 right-8 md:absolute md:right-4 md:top-1  rounded-lg md:rounded-none flex justify-center items-center gap-1.5 btn h-10 w-10 md:h-12 w-fit md:p-4 px-4.5 py-7  md:px-6 md:py-3">
         <Plus color="#ffffff" size={20}/> <span className="hidden md:block">Create New Project</span>
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array(5).fill(0).map((_, index) => (
          <ProjectTask key={index}/>
        ))}
        <div className="hidden md:flex flex-col justify-center items-center gap-4 rounded-lg shadow-sm">
          <span className="flex items-center justify-center p-3.5 rounded-lg surface-low">
            <CirclePlus size={20} color="#000000" absoluteStrokeWidth />
          </span>
          <span className="font-bold text-[14px]">ADD PROJECT</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-8 mb-12 md:mb-0 ">
        <span className="body-md text-[#434654]">Showing 5 of 24 active projects</span>
        <Pagination currentPage={page} totalPages={2} onPageChange={setPage} />
       </div>
       </>
  )
}

export default Projects