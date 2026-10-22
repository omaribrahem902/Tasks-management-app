import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import BoxName from "../../../components/BoxName";
import { formatDate } from "../../../utils/formatDate";
import {
  createNewEpicsSchema,
  getToday,
} from "../../createNewEpic/createNewEpicSchema";

import type { CreateNewEpicFormData } from "../../createNewEpic/createNewEpicSchema";
import type { epic } from "../projectEpicsPage/Epic";
import type { Member } from "../../members/MembersPage";

import EpicAssigneeSelect from "./EpicAssigneeSelect";
import { useUpdateEpic } from "./useUpdateEpic";
import toast, { Toaster } from "react-hot-toast";

interface EpicInfoProps {
  epic: epic;
  members: Member[];
  projectId: string | undefined;
}

const EpicModalInfo = ({ epic, members, projectId }: EpicInfoProps) => {
  const methods = useForm<CreateNewEpicFormData>({
    resolver: zodResolver(createNewEpicsSchema),

    defaultValues: {
      title: epic.title ?? "",
      description: epic.description ?? "",
      assigneeId: epic.assignee?.sub ?? "",
      deadline: epic.deadline ?? "",
    },
  });

  const {
    register,
    getValues,
    resetField,
    trigger,
    formState: { errors },
  } = methods;

  const { mutate, isPending } = useUpdateEpic(projectId ?? "", epic.epic_id);

  /**
   * Get the value currently stored on the server
   * to compare it with the new form value.
   */
  const getOriginalValue = (field: keyof CreateNewEpicFormData) => {
    switch (field) {
      case "title":
        return epic.title ?? "";

      case "description":
        return epic.description ?? "";

      case "assigneeId":
        return epic.assignee?.sub ?? "";

      case "deadline":
        return epic.deadline ?? "";

      default:
        return "";
    }
  };

  /**
   * Save one field only.
   */
  const saveField = async (
    field: keyof CreateNewEpicFormData,
    value: string,
  ) => {
    // Validate this field first
    const isValid = await trigger(field);

    if (!isValid) {
      return;
    }

    const originalValue = getOriginalValue(field);

    if (value === originalValue) {
      return;
    }

    /**
     * Map form fields to API fields
     */
    let payload;

    switch (field) {
      case "title":
        payload = {
          title: value,
        };
        break;

      case "description":
        payload = {
          description: value,
        };
        break;

      case "assigneeId":
        payload = {
          assignee_id: value || null,
        };
        break;

      case "deadline":
        payload = {
          deadline: value || null,
        };
        break;
    }

    mutate(payload, {
      onSuccess: () => {
        resetField(field, {
          defaultValue: value,
        });
      },
      onError: () => {
      toast.error("Failed to update epic. Please try again.");
    },
    });
  };

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <FormProvider {...methods}>
      {/* Title */}
      <div className="mb-4">
        <input
          type="text"
          {...register("title")}
          onBlur={() => {
            saveField("title", getValues("title"));
          }}
          disabled={isPending}
          className="w-full rounded-lg border p-3 text-xl font-semibold outline-none focus:border-blue-500"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <textarea
          {...register("description")}
          onBlur={() => {
            saveField("description", getValues("description"));
          }}
          placeholder="No description provided."
          disabled={isPending}
          className="h-37.5 w-full resize-none rounded-xl border p-3 outline-none focus:border-blue-500"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2 lg:grid-cols-3">
        {/* Created By */}
        <div className="flex flex-col items-start">
          <span className="mb-2 mr-1 text-[11px] text-[#737685]">
            CREATED BY
          </span>

          <div className="flex items-center">
            <BoxName
              name={epic.created_by.name}
              size={8}
              fontTheme="label-sm"
            />

            <span className="ml-2.5 body-md">{epic.created_by.name}</span>
          </div>
        </div>

        {/* Assignee */}
        <EpicAssigneeSelect
          members={members}
          onSave={(value) => {
            saveField("assigneeId", value);
          }}
          disabled={isPending}
        />

        {errors.assigneeId && (
          <p className="text-sm text-red-500">{errors.assigneeId.message}</p>
        )}

        {/* Deadline */}
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="deadline" className="label-sm">
            DEADLINE
          </label>

          <input
            id="deadline"
            type="date"
            min={getToday()}
            {...register("deadline")}
            onChange={(e) => {
              saveField("deadline", e.target.value);
            }}
            disabled={isPending}
            className="rounded-lg border p-2"
          />

          {errors.deadline && (
            <p className="text-sm text-red-500">{errors.deadline.message}</p>
          )}
        </div>

        {/* Created At */}
        <div className="mb-2 flex flex-col items-start">
          <span className="mb-2 mr-1 text-[11px] text-[#737685]">
            CREATED AT
          </span>

          <div className="flex items-center rounded-lg border p-2">
            <Calendar size={16} strokeWidth={1} />

            <span className="ml-2.5 body-md">
              {formatDate(epic.created_at)}
            </span>
          </div>
        </div>
      </div>
    </FormProvider>
    </>
  );
};

export default EpicModalInfo;
