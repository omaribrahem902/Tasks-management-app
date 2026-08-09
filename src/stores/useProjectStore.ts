import { create } from "zustand";
import type { ProjectTaskProps } from "../components/ProjectTask";
import { persist } from "zustand/middleware";
interface ProjectStore {
  currentProject: ProjectTaskProps | null;

  setCurrentProject: (project: ProjectTaskProps | null) => void;

  clearCurrentProject: () => void;
}

type ProjectMembers = {
  memberId: string;
  name: string;
};

interface ProjectMembersStore {
  members: ProjectMembers[];
  setMembers: (members: ProjectMembers[]) => void;
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
