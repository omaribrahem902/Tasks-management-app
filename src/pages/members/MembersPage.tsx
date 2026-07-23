import { EllipsisVertical, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumbs";
import BoxName from "../../components/BoxName";
import Label from "../../components/Label";
import { getMembers } from "./getMembersAPI";
import { useQuery } from "@tanstack/react-query";
import MembersPageSkeleton from "../../components/MembersPageSkeleton";
import ErrorPage from "../ErrorPage";

const MembersPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getMembers(projectId as string),
  });

  if (isLoading) {
    return <MembersPageSkeleton />;
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <ErrorPage />
      </div>
    );
  }
  console.log(data, "members data");

  return (
    <>
      <Breadcrumb />
      <div className=" relative mb-3 lg:mb-20 flex items-center justify-center md:justify-between">
        <h1 className="headline-lg">Project Members</h1>
        <button
          onClick={() => console.log("Invite Member button clicked")}
          className="btn fixed bottom-24 right-8 flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-4.5 py-7 md:absolute md:right-4 md:top-1 md:h-12 md:rounded-none md:p-4 md:px-6 md:py-3"
        >
          <UserPlus color="#fff" size={20} />

          <span className="hidden md:block">Invite Member</span>
        </button>
      </div>
      <div>
        <section className="flex justify-center ">
          <table className="lg:w-[785px] shadow-md rounded-md overflow-clip">
            <thead className="hidden md:block">
              <tr className="grid grid-cols-3 justify-center items-center py-5 px-[52px] bg-[#E0E8FF4D] label-sm ">
                <th className="flex justify-start ">MEMBERS</th>
                <th>ROLE</th>
                <th className="flex justify-end">ACTOINS</th>
              </tr>
            </thead>
            <tbody className="flex flex-col gap-3">
              {data?.map((member) => (<>
              <tr key={member.id} className="relative bg-white grid grid-cols-2 md:grid-cols-3 justify-center items-end md:items-center p-4 md:p-0 border-b">
                <td className="w-fit flex gap-4 justify-center items-center md:py-5 md:px-9">
                  <BoxName name={member.metadata.name} />
                  <div>
                    <h4 className="font-semibold text-[14px]">{member.metadata.name}</h4>
                    <p className="slate-4 text-[12px]">{member.email}</p>
                  </div>
                </td>
                <td className="absolute top-5 right-4 md:static flex justify-center items-center">
                  <Label text={member.role} />
                </td>
                <td className="flex justify-end items-center md:pr-8 cursor-pointer">
                  <EllipsisVertical size={20} />
                </td>
              </tr>
              </>))}
              
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default MembersPage;
