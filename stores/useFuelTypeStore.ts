import { create } from "zustand";

interface FuelType {
  id: string;         // uuid
  name: string;       // e.g. "PETROL"
  fuel_code: number;  // numeric code
}

interface FuelTypeStore {
  fuelTypes: FuelType[];
  loading: boolean;
  fetchFuelTypes: () => Promise<void>;
  setFuelTypes: (data: FuelType[]) => void;
}

export const useFuelTypeStore = create<FuelTypeStore>((set) => ({
  fuelTypes: [],
  loading: false,

  setFuelTypes: (data) => set({ fuelTypes: data }),

  fetchFuelTypes: async () => {
    set({ loading: true });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/fuel-types`
      );
      const json = await res.json();
      set({ fuelTypes: json.data, loading: false });
    } catch (err) {
      console.error("Error fetching fuel types:", err);
      set({ loading: false });
    }
  },
}));
