import NewArrivals from "../components/NewArrivals";
import BestSellingProducts from "../components/BestSellingProducts";
import FeaturedCategories from "../components/FeaturedCategories";
import Hero from "../components/hero/Hero";
import Navbar from "../components/ui/layout/Navbar";
import React from "react";
import DealSection from "../components/DealSection";
import PromotionalBanners from "../components/PromotionalBanners";
import BrandLogos from "../components/BrandLogos";

import InstagramSection from "../components/InstagramSection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <BestSellingProducts />
      <NewArrivals />
      <DealSection />
      <PromotionalBanners />
      <BrandLogos />
      <InstagramSection />
      <Footer />
    </>
  );
};

export default Home;
