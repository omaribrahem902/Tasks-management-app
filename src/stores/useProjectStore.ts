import { create } from "zustand";
import type { ProjectTaskProps } from "../components/ProjectTask";

interface ProjectStore {
  currentProject: ProjectTaskProps | null;

  setCurrentProject: (project: ProjectTaskProps | null) => void;

  clearCurrentProject: () => void;
}
export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,

  setCurrentProject: (project) =>
    set({
      currentProject: project,
    }),

  clearCurrentProject: () =>
    set({
      currentProject: null,
    }),
}));
