/* eslint-disable no-unused-vars */
import React from "react";
import Feature from "./Feature";
import Hero from "./Hero";
import ProductHeading from "./ProductHeading";
import LongBanner from "./LongBanner";
import SmallBanner from "./SmallBanner";
import BottomBanner from "./BottomBanner";

export default function Home() {
  return (
    <>
      <Hero />

      <Feature />
      <ProductHeading
        heading="Featured Products"
        para="Summer Collection New Modern Design"
        type={"T-Shirt"}
        />

      <LongBanner />

      <ProductHeading
        heading="New Arrivals"
        para="Summer Collection New Modern Designs"
        type={"Shirt"}
      />

      <SmallBanner />

      <BottomBanner />
    </>
  );
}
