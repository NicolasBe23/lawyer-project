"use client";

import HeaderLP from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Features from "@/components/landing-page/features";
import Steps from "@/components/landing-page/steps";
import Testimonials from "@/components/landing-page/testimonials";
import Banner from "@/components/landing-page/banner";
import Footer from "@/components/landing-page/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <HeaderLP />
      <Hero />

      <Features />
      <Steps />
      <Testimonials />

      <Banner />
      <Footer />
    </div>
  );
}
