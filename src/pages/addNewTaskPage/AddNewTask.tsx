import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Breadcrumb from "../../components/BreadCrumbs";
import ReusableForm from "../../components/ResuableForm/ReusableForm";
import type { FormButton } from "../../components/ResuableForm/types";
import { useProjectEpics } from "../../hooks/useProjectEpics";
import { useProjectMembers } from "../../hooks/useProjectMembers";
import { useSelectedEpicStore } from "../../stores/useProjectStore";
import {
  getTaskFormFields,
  taskSchema,
  type TaskFormValues,
} from "./fields";
import { useCreateTask } from "./useCreateTask";
import { useSelectedStatusStore } from "./useTasksStore";

const AddNewTask = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const selectedEpic = useSelectedEpicStore((state) => state.selectedEpic);
  const { selectedStatus } = useSelectedStatusStore();

  const { data: members } = useProjectMembers(projectId!);
  const { data: epicsData } = useProjectEpics(projectId);
  const { mutate: createTask, isPending } = useCreateTask(projectId);

  const fields = useMemo(
    () => getTaskFormFields(members, epicsData?.epics),
    [members, epicsData?.epics]
  );

  const buttons: FormButton[] = useMemo(
    () => [
      {
        label: "Back",
        type: "button",
        variant: "ghost",
        onClick: () => navigate(-1),
      },
      {
        label: isPending ? "Creating..." : "Create Task",
        type: "submit",
        variant: "primary",
      },
    ],
    [isPending, navigate]
  );

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
            isLoading={isPending}
            defaultValues={{
              title: "",
              status: selectedStatus.status || "",
              assignee_id: "",
              epic_id: selectedEpic?.id || "",
              due_date: "",
              description: "",
            }}
            onSubmit={(data) => createTask(data)}
          />
        </section>
      </div>
    </>
  );
};

export default AddNewTask;
