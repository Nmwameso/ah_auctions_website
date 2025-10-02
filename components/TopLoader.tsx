// components/TopLoader.tsx
"use client";

import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <NextTopLoader 
      color="#E53E3E" // Red color to match your theme
      height={3}
      shadow="0 0 10px #E53E3E, 0 0 5px #E53E3E"
      easing="ease"
      speed={200}
      showAtBottom={false}
      showSpinner={false}
    />
  );
}