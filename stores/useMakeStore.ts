import { create } from "zustand";

interface Make {
  make_id: string;
  make_name: string;
  image: string | null;
}

interface MakeStore {
  makes: Make[];
  loading: boolean;
  setMakes: (makes: Make[]) => void;
  fetchMakes: () => Promise<void>;
}

export const useMakeStore = create<MakeStore>((set) => ({
  makes: [],
  loading: false,

  setMakes: (makes) => set({ makes }),

  fetchMakes: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/v1/public/makes`, {
        cache: "no-store", // 🔑 ensures fresh data when using SSR
      });
      const data = await res.json();
      set({ makes: data?.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching makes:", err);
      set({ loading: false });
    }
  },
}));
