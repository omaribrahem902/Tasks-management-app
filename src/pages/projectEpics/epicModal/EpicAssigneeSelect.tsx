import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { CreateNewEpicFormData } from "../../createNewEpic/createNewEpicSchema";
import type { Member } from "../../members/MembersPage";

interface EpicAssigneeProps {
  members: Member[];
  onSave: (value: string) => void;
  disabled?: boolean;
}

const EpicAssigneeSelect = ({
  members,
  onSave,
  disabled = false,
}: EpicAssigneeProps) => {
  const { register } =
    useFormContext<CreateNewEpicFormData>();

  return (
    <div className="relative flex flex-1 flex-col">
      <label
        htmlFor="assigneeId"
        className="mb-2 mr-1 text-[11px] text-[#737685]"
      >
        ASSIGNEE
      </label>

      <select
        id="assigneeId"
        {...register("assigneeId", {
          onChange: (e) => {
            onSave(e.target.value);
          },
        })}
        disabled={disabled}
        className="appearance-none rounded-lg border p-2"
      >
        <option value="">
          Unassigned
        </option>

        {members.map((member) => (
          <option
            key={member.member_id}
            value={member.user_id}
          >
            {member.metadata.name}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-3 top-4/7"
        size={18}
      />
    </div>
  );
};

export default EpicAssigneeSelect;