import { create } from "zustand";
import type { ProjectTaskProps } from "../pages/projectsPages/ProjectTask";
import { persist } from "zustand/middleware";
import type { epic } from "../pages/projectEpics/projectEpicsPage/Epic";
interface ProjectStore {
  currentProject: ProjectTaskProps | null;

  setCurrentProject: (project: ProjectTaskProps | null) => void;

  clearCurrentProject: () => void;
}

export type ProjectMembers = {
  memberId: string;
  name: string;
};

interface ProjectMembersStore {
  members: ProjectMembers[];
  setMembers: (members: ProjectMembers[]) => void;
}

interface selectedEpicStore {
  selectedEpic: epic | null;
  setSelectedEpic: (epic: epic | null) => void;
  clearSelectedEpic: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      currentProject: null,

      setCurrentProject: (project) =>
        set({ currentProject: project }),

      clearCurrentProject: () =>
        set({ currentProject: null }),
    }),
    {
      name: "current-project",
    }
  )
);

export const useProjectMembersStore = create<ProjectMembersStore>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));

export const useSelectedEpicStore = create<selectedEpicStore>((set) => ({
  selectedEpic: null,
  setSelectedEpic: (epic) => set({ selectedEpic: epic }),
  clearSelectedEpic: () => set({ selectedEpic: null }),
}));

export interface SelectedTaskInfo {
  taskId: string;
  projectId: string;
}

interface SelectedTaskStore {
  selectedTask: SelectedTaskInfo | null;
  setSelectedTask: (task: SelectedTaskInfo | null) => void;
  clearSelectedTask: () => void;
}

export const useSelectedTaskStore = create<SelectedTaskStore>((set) => ({
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  clearSelectedTask: () => set({ selectedTask: null }),
}));

