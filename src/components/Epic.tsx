import { EllipsisVertical, UserPen } from "lucide-react";
import BoxName from "./BoxName";
import { formatDate } from "../utils/formatDate";


export interface EpicProps {
  epic_id: string;
  title: string;
  assignee: {
    name: string;
    avatar: string;
  }
  created_by: {
    name: string;
  }
  created_at: string;
}

const Epic = ({epic}: {epic: EpicProps}) => {
  return (
      <div className="h-55 flex flex-col p-4 bg-white border-l-4 border-[#004E32] rounded-md  shadow-sm cursor-pointer hover:shadow-xl transition-transform hover:scale-105 duration-300">
        <div className="flex justify-between items-start mb-4">
        <span className="py-1 px-2.5 success label-sm rounded-xs">{epic.epic_id}</span>
        <EllipsisVertical color="#041B3C33" />
        </div>
        <h1 className="text-xl font-semibold mb-3">{epic.title}</h1>
        <div className="flex  items-start mb-6">
          <BoxName name={epic.assignee.name} />
          <div className="flex flex-col ml-3">
          <span className="ml-2.5 body-md">Assignee</span>
          <span className="ml-2.5 body-md">{epic.assignee.name}</span>
          </div>

        </div>
        <hr />
        <div className="flex justify-between mt-4">
          <div className="flex">
            <UserPen strokeWidth={2} size={12} className="mr-2" color="#434654CC" />
            <span className="text-[#434654CC] text-[11px] mr-1">CREATED BY:</span>
             <span className="text-[11px] font-semibold">{epic.created_by.name}</span>
             </div>
          <span className="label-sm text-[#737685]">{formatDate(epic.created_at)}</span>
        </div>
      </div>

  )
}

export default Epic