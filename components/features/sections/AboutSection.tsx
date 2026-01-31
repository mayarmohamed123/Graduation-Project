import Image from "next/image";
import React from "react";
import { aboutImage } from "@/assets";

export default function AboutSection() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-8 md:px-20 py-20">
      {/* Section Title */}
      <h2 className="heading text-center mb-16">About Healing</h2>

      {/* Content Wrapper */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left - Image */}
        <div className="relative w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-[400px]">
          <Image
            src={aboutImage}
            alt="About Healing"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain rounded-2xl shadow-md"
            loading="lazy"
          />
        </div>

        {/* Right - Text */}
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <p className="text-gray-600 leading-relaxed">
            Healing is a modern healthcare platform that connects patients,
            doctors, and pharmacies in one trusted digital space.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make healthcare more accessible, reliable, and
            connected by helping users find nearby doctors, order medicines
            securely, and donate blood to those in need.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe that access to quality healthcare should be simple, safe,
            and available to everyone — anytime, anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}
