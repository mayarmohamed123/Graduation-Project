import React from "react";
import Image from "next/image";
import { heroSectionImage } from "@/assets";
import { Button } from "../ui";
export default function HeroSection() {
  return (
    <section
      id="home"
      className="max-w-7xl mx-auto flex gap-6 flex-col-reverse md:flex-row items-center justify-between mt-16 px-8 md:px-20 py-16">
      {/* Left Text Side */}
      <div className="flex-1 max-w-2xl space-y-6 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary leading-tight">
          Your Health, Connected with Sehha
        </h1>
        <p className="text-[#4D4D4D] font-semibold text-lg sm:text-xl md:text-2xl">
          Find trusted doctors near you, order medicines with ease, and donate
          blood — all in one secure, easy-to-use platform.
        </p>

        <Button
          size="lg"
          className="rounded-full bg-primary text-white px-8 py-6 text-lg hover:opacity-90 transition-all">
          Get Started
        </Button>
      </div>

      {/* Right Image Side */}
      <div className="relative w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mb-6 md:mb-0 flex justify-center">
        <Image
          src={heroSectionImage}
          alt="Hero illustration"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
