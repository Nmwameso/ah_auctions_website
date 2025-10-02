import VehicleListing from './VehicleListing';
import { getServerSideData } from './server-actions';

// This is a Server Component that fetches data
export default async function VehiclesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // ✅ Await the searchParams Promise first
  const resolvedSearchParams = await searchParams;
  
  const urlSearchParams = new URLSearchParams();
  
  // Convert searchParams to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  });

  const serverData = await getServerSideData(urlSearchParams);
  
  return <VehicleListing serverData={serverData} searchParams={resolvedSearchParams} />;
}