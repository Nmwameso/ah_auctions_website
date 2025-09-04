"use client";

import Banner from "../../components/Banner";
import AboutUs from "../../components/AboutUs";
import PopularBodyTypes from "../../components/PopularBodyTypes";
import LatestTrucks from "../../components/LatestTrucks";

export default function HomePage() {
  return (
    <>
      {/* ✅ Components */}
      <Banner />
      <LatestTrucks />
      <AboutUs />
      <PopularBodyTypes />
      

    </>
  );
}
