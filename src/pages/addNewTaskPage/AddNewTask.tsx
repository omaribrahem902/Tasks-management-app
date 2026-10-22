import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ReusableForm from "../../components/ResuableForm/ReusableForm";
import type {
  FormButton,
  FormFieldConfig,
} from "../../components/ResuableForm/types";

import type { Member } from "../members/MembersPage";
import type { epic } from "../projectEpics/projectEpicsPage/Epic";
import { getEpicsAPI } from "../projectEpics/projectEpicsPage/GetProjectEpicsAPI";
import Breadcrumb from "../../components/BreadCrumbs";
import { addNewTaskAPI } from "./addNewTaskAPI";
import { useProjectMembers } from "../../hooks/useProjectMembers";
import { useSelectedEpicStore } from "../../stores/useProjectStore";

interface TaskFormValues {
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status?: string;
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  status: z.string().min(1, "Status is required"),
  assignee_id: z.string(),
  epic_id: z.string(),
  due_date: z.string(),
  description: z.string(),
});

const AddNewTask = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const selectedEpic = useSelectedEpicStore((state) => state.selectedEpic);
  console.log("selectedEpic", selectedEpic);

  const {
    data: members,
    isLoading: membersLoading,
    error: membersError,
  } = useProjectMembers(projectId!);

  const {
    data: epics,
    isLoading: epicsLoading,
    error: epicsError,
  } = useQuery({
    queryKey: ["epics", projectId],
    queryFn: () => getEpicsAPI({ projectId: projectId as string }),
  });

  // === Create Task Mutation ===
  const createTaskMutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      addNewTaskAPI({ ...data, project_id: projectId as string }),

    onSuccess: () => {
      toast.success("Task created successfully!");

      // تحديث أي list متعلقة بالـ tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // تقدر ترجع لصفحة المهام أو المشروع
      // navigate(`/project/${projectId}/tasks`);
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create task. Please try again.";

      toast.error(message);
    },
  });

  const fields: FormFieldConfig<TaskFormValues>[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "e.g., Finalize structural schematics",
      colSpan: 2,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      placeholder: "Select Status",
      options: [
        { label: "TO DO", value: "TO_DO" },
        { label: "IN PROGRESS", value: "IN_PROGRESS" },
        { label: "BLOCKED", value: "BLOCKED" },
        { label: "IN_REVIEW", value: "IN_REVIEW" },
        { label: "READY_FOR_QA", value: "READY_FOR_QA" },
        { label: "REOPENED", value: "REOPENED" },
        { label: "READY_FOR_PRODUCTION", value: "READY_FOR_PRODUCTION" },
        { label: "DONE", value: "DONE" },
      ],
    },
    {
      name: "assignee_id",
      label: "Assignee",
      type: "select",
      placeholder: "Select Team Member",
      options:
        members?.map((member: Member) => ({
          label: member.metadata.name,
          value: member.user_id,
        })) || [],
    },
    {
      name: "epic_id",
      label: "Epic",
      type: "select",
      placeholder: "Select Epic Link",
      colSpan: 2,
      options:
        epics?.epics?.map((epic: epic) => ({
          label: `${epic.epic_id} ${
            epic.title.length > 100
              ? epic.title.slice(0, 100) + "..."
              : epic.title
          }`,
          value: epic.id,
        })) || [],
    },
    {
      name: "due_date",
      label: "Due Date",
      type: "date",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Provide detailed context for this task...",
      colSpan: 2,
    },
  ];

  const buttons: FormButton[] = [
    {
      label: "Back",
      type: "button",
      variant: "ghost",
      // onClick: () => navigate(-1),
    },
    {
      label: createTaskMutation.isPending ? "Creating..." : "Create Task",
      type: "submit",
      variant: "primary",
      // disabled: createTaskMutation.isPending,  // لو الـ ReusableForm بيدعم disabled
    },
  ];

  const handleCreateTask = async (data: TaskFormValues) => {
    createTaskMutation.mutate(data);
  };

  return (
    <>
      <Breadcrumb />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mb-3 lg:mb-20">
        <h1 className="headline-lg">Create New Task</h1>
        <p className="body-md max-w-lg text-[16px] slate-4">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <section className="flex w-full max-w-2xl flex-col rounded-lg bg-white p-6 md:p-8 mb-15 lg:mb-0">
          <ReusableForm<TaskFormValues>
            fields={fields}
            buttons={buttons}
            schema={taskSchema}
            defaultValues={{
              title: "",
              status: "TO_DO",
              assignee_id: "",
              epic_id: selectedEpic?.id || "",
              due_date: "",
              description: "",
            }}
            onSubmit={handleCreateTask}
          />
        </section>
      </div>
    </>
  );
};

export default AddNewTask;
