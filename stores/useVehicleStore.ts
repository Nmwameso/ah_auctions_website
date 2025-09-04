import { create } from "zustand";

interface Vehicle {
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

  // Pagination state from backend
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  fetchVehicles: (page?: number) => Promise<void>;
  fetchVehicleById: (vehicle_id: string) => Promise<void>;
  setPage: (page: number) => Promise<void>;
  clearVehicle: () => void;
  searchVehicles: (params: {
    query?: string;
    make?: string;
    model?: string;
    year?: string;
    colour?: string;
    page?: number;
  }) => Promise<void>;
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

  /**
   * Fetch paginated vehicles from API
   */
  fetchVehicles: async (page = 1) => {
    set({ loading: true, error: null });

    try {
      const { perPage } = get();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/vehicles?page=${page}&per_page=${perPage}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error(`Failed to fetch vehicles: ${res.status}`);
      const data = await res.json();

      set({
        vehicles: data.data || [],
        currentPage: Array.isArray(data.meta.current_page)
          ? data.meta.current_page[0]
          : data.meta.current_page,
        totalPages: Array.isArray(data.meta.last_page)
          ? data.meta.last_page[0]
          : data.meta.last_page,
        perPage: Array.isArray(data.meta.per_page)
          ? data.meta.per_page[0]
          : data.meta.per_page,
        total: Array.isArray(data.meta.total)
          ? data.meta.total[0]
          : data.meta.total,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },

  /**
   * Go to a specific page
   */
  setPage: async (page: number) => {
    const { totalPages, fetchVehicles } = get();
    if (page < 1 || page > totalPages) return;
    await fetchVehicles(page);
  },

  /**
   * Fetch single vehicle details by ID
   */
  fetchVehicleById: async (vehicle_id: string) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/vehicles/${vehicle_id}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error(`Failed to fetch vehicle: ${res.status}`);
      const data = await res.json();

      set({ vehicle: data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },

  /**
   * Search vehicles with filters (NEW)
   */
  searchVehicles: async ({ query = "", make = "", model = "", year = "", colour = "", page = 1 }) => {
    set({ loading: true, error: null });

    try {
      const { perPage } = get();
      const params = new URLSearchParams({
        query,
        make,
        model,
        year,
        colour,
        page: String(page),
        per_page: String(perPage),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/v1/public/vehicles?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error(`Failed to search vehicles: ${res.status}`);
      const data = await res.json();

      set({
        vehicles: data.data.data || [],
        currentPage: data.data.meta?.current_page || 1,
        totalPages: data.data.meta?.last_page || 1,
        perPage: data.data.meta?.per_page || perPage,
        total: data.data.meta?.total || 0,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Search failed", loading: false });
    }
  },

  /**
   * Clear vehicle details
   */
  clearVehicle: () => set({ vehicle: null }),
}));
