import { create } from "zustand";
import axios from "axios";

interface Model {
  model_id: string;
  model_name: string;
}

interface ModelStore {
  models: Model[];
  loading: boolean;
  fetchModels: (makeId: string) => Promise<void>;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [],
  loading: false,
  fetchModels: async (makeId) => {
    try {
      set({ loading: true });

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/v1/public/makes/${makeId}/models`);

      // ✅ Access res.data.data
      set({ models: res.data.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching models:", err);
      set({ loading: false });
    }
  },
}));
