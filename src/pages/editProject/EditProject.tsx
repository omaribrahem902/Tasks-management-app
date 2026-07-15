import { z } from "zod";
import { ClockPlus } from "lucide-react";
import Breadcrumb from "../../components/BreadCrumbs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { addNewProjectSchema } from "../../schemas/addNewProjectSchema";
import { useMutation } from "@tanstack/react-query";
import InputField from "../../components/InputField";
import { useNavigate, useParams } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import { editProjectAPI } from "./editProjectApi";
import { useProjectStore } from "../../stores/useProjectStore";



type FormData = z.infer<typeof addNewProjectSchema>;

const editProjectFields: { label: string; id: keyof FormData }[] = [
  { label: "PROJECT NAME", id: "name" },
  { label: "DESCRIPTION", id: "description" },
];
const EditProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const currentProject = useProjectStore((state) => state.currentProject);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addNewProjectSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => editProjectAPI(data, projectId!),
    onSuccess: () => {
      reset();
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      name: data.name,
      description: data.description,
    });
  };
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Breadcrumb />
      <div className="flex justify-between items-center mb-10 slate-1 text-4xl font-semibold">
        <h1 className="hidden md:block text-4xl font-semibold">
          Edit Project
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <section className=" flex justify-start  flex-col bg-white p-6 md:p-8 rounded-lg">
          <div className="flex justify-start items-center gap-4 mb-10">
            <span className="hidden md:flex p-3 primary-container opacity-10  justify-center items-center">
              <ClockPlus size={22} color="#ffffff" />
            </span>

            <div className="">
              <h1 className="text-2xl">Edit Project</h1>
              <p className=" slate-2 body-md">
                please enter your details to access to your workspace
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 mt-10"
          >
            {editProjectFields.map((field) => (
              <InputField
                key={field.id}
                label={field.label}
                optional={field.id === "description"}
                id={field.id}
                register={register}
                errors={errors}
                value={currentProject ? currentProject[field.id] : ""}
              />
            ))}
            <div className="text-sm text-slate-500 text-right">
              0/500 characters
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-between mt-6 mb-12">
              <button
                onClick={() => navigate("/project")}
                className="cursor-pointer"
              >
                Back
              </button>
              <button className="btn general-btn rounded-sm mb-4 md:mb-0" type="submit">
                Save Changes
              </button>
            </div>
          </form>
          <div className="w-full flex-center text-[12px] py-6 surface-low px-5 mb-10 md:mb-0">
            <span className="label-sm slate-2">Pro Tip: </span> You can invite
            project members and assign epics immediately after the initial
            creation process.
          </div>
        </section>
      </div>
    </>
  );
};

export default EditProject;
