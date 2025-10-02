import { create } from "zustand";

interface Model {
  model_id: string;
  model_name: string;
}

interface ModelStore {
  models: Model[];
  loading: boolean;
  fetchModels: (makeId: string) => Promise<void>;
  setModels: (models: Model[]) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [],
  loading: false,

  setModels: (models: Model[]) => set({ models }),

  fetchModels: async (makeId: string) => {
    try {
      set({ loading: true });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/makes/${makeId}/models`,
        { cache: "no-store" } // ✅ ensures SSR fresh data
      );
      const data = await res.json();
      set({ models: data?.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching models:", err);
      set({ loading: false });
    }
  },
}));
