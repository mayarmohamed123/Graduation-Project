import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import HeroSectionPhoto from "@/assets/HeroSection.png";
export default function HeroSection() {
  return (
    <section className="flex gap-6 flex-col-reverse md:flex-row items-center justify-center mt-16 px-8 md:px-20 py-16">
      {/* Left Text Side */}
      <div className="max-w-2xl space-y-6 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-semibold text-primary leading-tight">
          Your Health, Connected with Sehha
        </h1>
        <p className="text-[#4D4D4D] font-semibold text-2xl">
          Find trusted doctors near you, order medicines with ease, and donate
          blood — all in one secure, easy-to-use platform.
        </p>

        <Button
          size="lg"
          className="rounded-full bg-primary text-white px-6 py-3 text-lg">
          Get Started
        </Button>
      </div>

      {/* Right Image Side */}
      <div className="relative w-full md:w-[588px] h-[600px] mb-10 md:mb-0">
        <Image
          src={HeroSectionPhoto}
          alt="Hero illustration"
          fill
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
