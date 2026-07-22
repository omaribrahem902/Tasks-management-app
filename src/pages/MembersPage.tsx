import { EllipsisVertical, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumbs";
import BoxName from "../components/BoxName";
import Label from "../components/Label";


const MembersPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    console.log("Project ID:", projectId); 
  return (
    <>
      <Breadcrumb />
      <div className="flex justify-between items-center mb-10 slate-1 text-4xl font-semibold">
        <h1 className="hidden md:block text-4xl font-semibold">
           Project Members
        </h1>
        <button className="hidden md:flex btn py-3.5 px-7 font-bold text-[14px] gap-2">
          <UserPlus size={14} color="#ffffff" /> Invite Member
        </button>
      </div>
      <div className="">
        <section className="flex justify-center ">
          <table className="lg:w-[785px] shadow-md rounded-md overflow-clip">
          <th className="grid grid-cols-3 justify-center items-center py-5 px-[52px] bg-[#E0E8FF4D] label-sm  ">
            <td className="flex justify-start ">MEMBERS</td>
            <td>ROLE</td>
            <td className="flex justify-end">ACTOINS</td>
          </th>
          <tr className="bg-white grid grid-cols-3 justify-center items-center">
            <td className="w-fit flex gap-4 justify-center items-center py-5 px-9">
              <BoxName/>
              <div>
                <h4 className="font-semibold text-[14px]">fwefew</h4>
                <p className="slate-4 text-[12px]">vdsfwdfwefwefewe</p>
              </div>
            </td>
            <td className="flex justify-center items-center"><Label/></td>
            <td className="flex justify-end items-center pr-8 cursor-pointer"><EllipsisVertical /></td>
          </tr>
          </table>
        </section>
      </div>
    </>
  )
}

export default MembersPage