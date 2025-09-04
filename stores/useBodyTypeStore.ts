import { create } from "zustand";
import axios from "axios";

interface BodyType {
  body_type_id: string;
  body_type_name: string;
}

interface BodyTypeStore {
  bodyTypes: BodyType[];
  loading: boolean;
  fetchBodyTypes: () => Promise<void>;
}

export const useBodyTypeStore = create<BodyTypeStore>((set) => ({
  bodyTypes: [],
  loading: false,

  fetchBodyTypes: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/v1/public/body-types`);

      // ✅ Ensure proper data extraction
      set({ bodyTypes: res.data.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching body types:", err);
      set({ loading: false });
    }
  },
}));
