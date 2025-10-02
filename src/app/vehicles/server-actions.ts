'use server';

import { useVehicleStore } from "../../../stores/useVehicleStore";
import { useMakeStore } from "../../../stores/useMakeStore";
import { useModelStore } from "../../../stores/useModelStore";
import { useBodyTypeStore } from "../../../stores/useBodyTypeStore";
import { useFuelTypeStore } from "../../../stores/useFuelTypeStore"; // ✅ new import

// Server-side function to fetch initial data
export async function getServerSideData(searchParams: URLSearchParams) {
  const vehicleStore = useVehicleStore.getState();
  const makeStore = useMakeStore.getState();
  const modelStore = useModelStore.getState();
  const bodyTypeStore = useBodyTypeStore.getState();
  const fuelTypeStore = useFuelTypeStore.getState(); // ✅

  // Extract filters from URL
  const query = searchParams.get("query") || undefined;
  const make = searchParams.get("make") || undefined;
  const model = searchParams.get("model") || undefined;
  const body_type = searchParams.get("body_type") || undefined;
  const minPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined;
  const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined;
  const minYear = searchParams.get("min_year") ? Number(searchParams.get("min_year")) : undefined;
  const maxYear = searchParams.get("max_year") ? Number(searchParams.get("max_year")) : undefined;
  const sortBy = searchParams.get("sort_by") || undefined;
  const vehicleType = searchParams.get("vehicle_type") || undefined;
  const fuel_type = searchParams.get("fuel_type") || undefined; // ✅ new filter
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  try {
    // Fetch all data in parallel
    await Promise.all([
      // Fetch dropdown data if not already loaded
      bodyTypeStore.bodyTypes.length === 0 ? bodyTypeStore.fetchBodyTypes() : Promise.resolve(),
      makeStore.makes.length === 0 ? makeStore.fetchMakes() : Promise.resolve(),
      fuelTypeStore.fuelTypes.length === 0 ? fuelTypeStore.fetchFuelTypes() : Promise.resolve(), // ✅ fetch fuel types
      
      // Fetch models if make is specified
      make ? modelStore.fetchModels(make) : Promise.resolve(),
      
      // Fetch vehicles with filters
      vehicleStore.getVehicles({
        query,
        make,
        model,
        body_type,
        min_price: minPrice,
        max_price: maxPrice,
        min_year: minYear,
        max_year: maxYear,
        sort_by: sortBy,
        vehicle_type: vehicleType,
        fuel_type, // ✅ send fuel_type filter
        page,
      }),
    ]);

    return {
      initialVehicles: vehicleStore.vehicles,
      initialPagination: {
        currentPage: vehicleStore.currentPage,
        totalPages: vehicleStore.totalPages,
        total: vehicleStore.total,
      },
      initialMakes: makeStore.makes,
      initialModels: modelStore.models,
      initialBodyTypes: bodyTypeStore.bodyTypes,
      initialFuelTypes: fuelTypeStore.fuelTypes, // ✅ add to returned payload
      initialLoading: false,
    };
  } catch (error) {
    console.error('Error in getServerSideData:', error);
    
    return {
      initialVehicles: [],
      initialPagination: {
        currentPage: 1,
        totalPages: 0,
        total: 0,
      },
      initialMakes: [],
      initialModels: [],
      initialBodyTypes: [],
      initialFuelTypes: [], // ✅ fallback
      initialLoading: false,
    };
  }
}
