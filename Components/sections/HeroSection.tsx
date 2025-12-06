import React from "react";
import Image from "next/image";
import { heroSectionImage } from "@/assets";
import { Button } from "../ui";
export default function HeroSection() {
  return (
    <section
      id="home"
      className="max-w-8xl mx-auto flex gap-6 flex-col-reverse md:flex-row items-center justify-center mt-16 px-8 md:px-20 py-16">
      {/* Left Text Side */}
      <div className="max-w-2xl space-y-6 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-tight">
          Your Health, Connected with Sehha
        </h1>
        <p className="text-[#4D4D4D] font-semibold text-lg sm:text-xl md:text-2xl">
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
      <div className="relative w-full md:w-[588px] h-[300px] sm:h-[400px] md:h-[600px] mb-6 md:mb-0">
        <Image
          src={heroSectionImage}
          alt="Hero illustration"
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 588px"
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
