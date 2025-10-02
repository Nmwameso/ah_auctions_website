'use server';

import { useVehicleStore } from "../../../../stores/useVehicleStore";

// Server-side function to fetch vehicle data
export async function getVehicleServerData(slug: string) {
  // Validate slug
  if (!slug || typeof slug !== 'string') {
    return {
      initialVehicle: null,
      initialLoading: false,
      initialError: 'Invalid vehicle ID',
    };
  }

  const vehicleStore = useVehicleStore.getState();

  try {
    // Clear any existing vehicle data first
    vehicleStore.clearVehicle();
    
    // Fetch the specific vehicle
    await vehicleStore.fetchVehicleById(slug);

    return {
      initialVehicle: vehicleStore.vehicle,
      initialLoading: vehicleStore.loading,
      initialError: vehicleStore.error,
      slug: slug, // Include the ID in the response
    };
  } catch (error) {
    console.error('Error in getVehicleServerData:', error);
    
    return {
      initialVehicle: null,
      initialLoading: false,
      initialError: 'Failed to fetch vehicle data',
      slug: slug,
    };
  }
}