import { useState } from "react";
import { EllipsisVertical, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumbs";
import BoxName from "../../components/BoxName";
import Label from "../../components/Label";
import MembersPageSkeleton from "./MembersPageSkeleton";
import ErrorPage from "../ErrorPage";
import { useProjectMembers } from "../../hooks/useProjectMembers";
import { InviteMemberModal } from "./InviteMemberModal";
import { useAppSelector } from "../../stores/hooks";

export interface Member {
  user_id: string;
  email: string;
  role: string;
  member_id: string;
  metadata: {
    name: string;
  };
}

const MembersPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const currentUser = useAppSelector((state) => state.user.data);
  const { data: members, isLoading, error } = useProjectMembers(projectId!);

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

  // Determine if the current user has permission to invite (admin or owner)
  const currentMember = members?.find(
    (m: Member) => m.user_id === currentUser?.id
  );
  const isAdmin = currentMember
    ? currentMember.role?.toLowerCase() === "admin" ||
      currentMember.role?.toLowerCase() === "owner"
    : true; // Default to visible if member not found yet; backend enforces authorization

  return (
    <>
      <Breadcrumb />
      <div className="relative mb-3 lg:mb-20 flex items-center justify-center md:justify-between">
        <h1 className="headline-lg">Project Members</h1>
        {isAdmin && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="btn fixed bottom-24 right-8 flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-4.5 py-7 md:absolute md:right-4 md:top-1 md:h-12 md:rounded-none md:p-4 md:px-6 md:py-3 cursor-pointer"
          >
            <UserPlus color="#fff" size={20} />
            <span className="hidden md:block">Invite Member</span>
          </button>
        )}
      </div>

      <div>
        <section className="flex justify-center">
          <table className="lg:w-196.25 shadow-md rounded-md overflow-clip">
            <thead className="hidden md:block">
              <tr className="grid grid-cols-3 justify-center items-center py-5 px-13 bg-[#E0E8FF4D] label-sm">
                <th className="flex justify-start">MEMBERS</th>
                <th>ROLE</th>
                <th className="flex justify-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="flex flex-col gap-3">
              {members?.map((member: Member) => (
                <tr
                  key={member.member_id}
                  className="relative bg-white grid grid-cols-2 md:grid-cols-3 justify-center items-end md:items-center p-4 md:p-0 border-b"
                >
                  <td className="w-fit flex gap-4 justify-center items-center md:py-5 md:px-9">
                    <BoxName name={member.metadata.name} />
                    <div>
                      <h4 className="font-semibold text-[14px]">
                        {member.metadata.name}
                      </h4>
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
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {projectId && isInviteModalOpen && (
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          projectId={projectId}
        />
      )}
    </>
  );
};

export default MembersPage;
