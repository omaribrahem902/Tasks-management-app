import { createNewEpicAPI } from "./createNewEpicAPI";
import Breadcrumb from "../../components/BreadCrumbs";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { getMembers } from "../members/getMembersAPI";
import ErrorPage from "../ErrorPage";
import MembersPageSkeleton from "../../components/MembersPageSkeleton";
import { createNewEpicsSchema, getToday } from "./createNewEpicSchema";
import { useProjectStore } from "../../stores/useProjectStore";
import { ChevronDown } from "lucide-react";

type FormData = z.infer<typeof createNewEpicsSchema>;

const createNewEpicsFields: {label: string;id: "name" | "description";}[] = [
  {
    label: "EPIC NAME",
    id: "name",
  },
  {
    label: "DESCRIPTION",
    id: "description",
  },
];

const CreateNewEpic = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const currentProject = useProjectStore((state) => state.currentProject);
  const { data, isLoading, error } = useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getMembers(projectId as string),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createNewEpicsSchema),
  });

  const mutation = useMutation({
    mutationFn: createNewEpicAPI,
    onSuccess: () => {
      reset();
      toast.success("Epic created successfully");
    },

    onError: () => {
      toast.error("Epic creation failed try again");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      name: data.name,
      description: data.description,
      assigneeId: data.assigneeId,
      deadline: data.deadline,
      projectId: projectId!,
    });
  };

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
  console.log("currentProject", currentProject);
  return (
    <>
      <Breadcrumb />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mb-3 lg:mb-20">
        <h1 className="headline-lg">Create New Epic</h1>

        <p className="body-md max-w-md text-[16px] slate-4">
          Define a major project phase or high-level milestone to group related
          tasks and track architectural progress.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <section className="flex w-full max-w-2xl flex-col rounded-lg bg-white p-6 md:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6 mt-10"
          >
            <div>
              {/* Name & Description */}
              {createNewEpicsFields.map((field) => (
                <InputField
                  key={field.id}
                  label={field.label}
                  optional={field.id === "description"}
                  id={field.id}
                  register={register}
                  errors={errors}
                />
              ))}

              {/* Description counter */}
              <div className="text-right text-sm text-slate-500 mt-1">
                0/500 characters
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 ">
              {/* Assignee */}
              <div className="relative flex flex-1 flex-col gap-2">
                <label htmlFor="assigneeId" className="label-sm">
                  ASSIGNEE
                </label>

                <select
                  id="assigneeId"
                  defaultValue=""
                  {...register("assigneeId")}
                  className="input-field-custom appearance-none"
                >
                  <option value="" disabled hidden>
                    Select an assignee
                  </option>

                  {data?.map((member) => (
                    <option key={member.member_id} value={member.user_id}>
                      {member.metadata.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2"
                  size={18}
                />

                {errors.assigneeId && (
                  <p className="text-sm text-red-500">
                    {errors.assigneeId.message}
                  </p>
                )}
              </div>

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
                  className="input-field-custom"
                />

                {errors.deadline && (
                  <p className="text-sm text-red-500">
                    {errors.deadline.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 mb-6 flex flex-col-reverse justify-end md:flex-row gap-0 md:gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="cursor-pointer general-btn mb-4 rounded-sm md:mb-0"
              >
                Cancel
              </button>

              <button
                className="btn general-btn mb-4 rounded-sm md:mb-0"
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create Epic"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default CreateNewEpic;
