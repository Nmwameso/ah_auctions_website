import { create } from "zustand";

interface BodyType {
  body_type_id: string;
  body_type_name: string;
}

interface BodyTypeStore {
  bodyTypes: BodyType[];
  loading: boolean;
  setBodyTypes: (bodyTypes: BodyType[]) => void;
  fetchBodyTypes: () => Promise<void>;
}

export const useBodyTypeStore = create<BodyTypeStore>((set) => ({
  bodyTypes: [],
  loading: false,

  setBodyTypes: (bodyTypes) => set({ bodyTypes }),

  fetchBodyTypes: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/v1/public/body-types`, {
        cache: "no-store", // ✅ for SSR freshness
      });

      const data = await res.json();
      set({ bodyTypes: data?.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching body types:", err);
      set({ loading: false });
    }
  },
}));
