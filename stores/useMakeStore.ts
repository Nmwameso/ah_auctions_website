import { create } from "zustand";
import axios from "axios";

interface Make {
  make_id: string;
  make_name: string;
  image: string | null;
}

interface MakeStore {
  makes: Make[];
  loading: boolean;
  fetchMakes: () => Promise<void>;
}

export const useMakeStore = create<MakeStore>((set) => ({
  makes: [],
  loading: false,
  fetchMakes: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/v1/public/makes`);

      // ✅ Access data.data since API response is { data: [ ... ] }
      set({ makes: res.data.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching makes:", err);
      set({ loading: false });
    }
  },
}));
