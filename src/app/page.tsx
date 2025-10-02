"use client";

import Banner from "../../components/Banner";
import AboutUs from "../../components/AboutUs";
import PopularBodyTypes from "../../components/PopularBodyTypes";
import LatestVehicles from "../../components/LatestVehicles";

export default function HomePage() {
  return (
    <>
      {/* ✅ Components */}
      <Banner />
      <LatestVehicles />
      <AboutUs />
      <PopularBodyTypes />
      

    </>
  );
}
