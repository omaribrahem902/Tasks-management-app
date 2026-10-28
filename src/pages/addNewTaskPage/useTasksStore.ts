import { create } from "zustand";

interface selectedStatus{
    status : string
}

interface useSelectedStatusStore {
  selectedStatus: selectedStatus;
  setSelectedStatus: (status: selectedStatus) => void;
  clearSelectedStatus: () => void;
}

export const useSelectedStatusStore = create<useSelectedStatusStore>((set) => ({
  selectedStatus: { status : ""},
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  clearSelectedStatus: () => set({ selectedStatus: { status : ""} }),
}));


