import { create } from "zustand";

interface Vehicle {
  slug: string;
  vehicle_id: string;
  make: string;
  model: string;
  grade: string | null;
  transm: string | null;
  colour: string | null;
  year: number;
  month: number;
  engine_cc: string | null;
  drive: string | null;
  fuel: string;
  price: number;
  price_usd: number;
  body_type_name: string;
  mileage: number;
  mileage_unit: string;
  no_of_doors: number;
  no_of_seats: number;
  accident_flg: number;
  main_photo: string | null;
  more_info: string | null;
  features?: string[];
  photos?: { image_url: string }[];
  accident_status: number;
  inventory_no: string | null;
  vehicle_type: number;
}

interface VehicleState {
  vehicles: Vehicle[];
  vehicle: Vehicle | null;
  loading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  // Actions
  getVehicles: (params?: {
    query?: string;
    make?: string;
    model?: string;
    min_price?: number | string;
    max_price?: number | string;
    body_type?: string;
    fuel_type?: string;
    year?: string;
    colour?: string;
    sort_by?: string;
    vehicle_type?: string;
    page?: number;
    currency?: "USD" | "JPY";
  }) => Promise<void>;

  fetchVehicleById: (slug: string) => Promise<void>;
  setPage: (page: number) => Promise<void>;
  clearVehicle: () => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setVehicle: (vehicle: Vehicle | null) => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  vehicle: null,
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 18,
  totalPages: 1,
  total: 0,

  setVehicles: (vehicles) => set({ vehicles }),
  setVehicle: (vehicle) => set({ vehicle }),

  getVehicles: async (params = {}) => {
    if (get().loading) return; // prevent double calls
    set({ loading: true, error: null });

    try {
      const { perPage } = get();
      const {
        query = "",
        make = "",
        model = "",
        body_type = "",
        fuel_type = "",
        year = "",
        colour = "",
        min_price = "",
        max_price = "",
        sort_by = "",
        vehicle_type = "",
        page = 1,
        currency = "USD",
      } = params;

      const queryParams = new URLSearchParams({
        ...(query && { query }),
        ...(make && { make }),
        ...(model && { model }),
        ...(body_type && { body_type }),
        ...(fuel_type && { fuel_type }),
        ...(year && { year }),
        ...(colour && { colour }),
        ...(min_price && { min_price: String(min_price) }),
        ...(max_price && { max_price: String(max_price) }),
        ...(sort_by && { sort_by }),
        ...(vehicle_type && { vehicle_type }),
        ...(currency && { currency }),
        page: String(page),
        per_page: String(perPage),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/vehicles?${queryParams.toString()}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error(`Failed to fetch vehicles: ${res.status}`);
      const json = await res.json();

      const list = json.data?.data || [];
      const meta = json.data?.meta || {};

      set({
        vehicles: list,
        currentPage: meta.current_page || 1,
        totalPages: meta.last_page || 1,
        perPage: meta.per_page || perPage,
        total: meta.total || 0,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch vehicles",
        loading: false,
      });
    }
  },

// In your vehicle store, update the setPage method:
setPage: async (page: number) => {
  const { totalPages, getVehicles } = get();
  if (page < 1 || page > totalPages) return;
  
  // ✅ Immediately update the current page in store for UI responsiveness
  set({ currentPage: page });
  
  // Get current filters from URL or store state to maintain them
  await getVehicles({ page });
},
  fetchVehicleById: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/vehicles/${slug}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Failed to fetch vehicle: ${res.status}`);
      const data = await res.json();
      set({ vehicle: data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Something went wrong",
        loading: false,
      });
    }
  },

  clearVehicle: () => set({ vehicle: null }),
}));
