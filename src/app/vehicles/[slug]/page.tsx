// /app/vehicles/[vehicle_id]/page.tsx
import type { Metadata } from 'next';
import VehicleDetailPage from './VehicleDetailPage';
import { getVehicleServerData } from './server-actions';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  
  try {
    const serverData = await getVehicleServerData(slug);
    const vehicle = serverData.initialVehicle;

    if (!vehicle) {
      return {
        title: 'Vehicle Not Found - Car Import',
        description: 'The requested vehicle could not be found.',
      };
    }

    const title = `${vehicle.make} ${vehicle.model} ${vehicle.year} - Car Import`;
    const description = `Explore the ${vehicle.year} ${vehicle.make} ${vehicle.model}. ${vehicle.fuel} • ${vehicle.transm} • ${vehicle.mileage} ${vehicle.mileage_unit}. Import your dream car today!`;
    const mainImage = vehicle.main_photo;

    return {
      title,
      description,
      keywords: [`${vehicle.make}`, `${vehicle.model}`, 'imported cars', 'japan cars', 'used cars', `${vehicle.year} ${vehicle.make} ${vehicle.model}`],
      openGraph: {
        title,
        description,
        images: mainImage ? [mainImage] : [],
        type: 'website',
        url: `http://localhost:3000/vehicles/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: mainImage ? [mainImage] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Vehicle Details - Car Import',
      description: 'Find your perfect imported vehicle with detailed specifications and photos.',
    };
  }
}

export default async function VehicleDetailServerPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const slug = params.slug;
  const serverData = await getVehicleServerData(slug);
  
  return <VehicleDetailPage serverData={serverData} slug={slug} />;
}