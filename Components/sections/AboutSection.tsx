import Image from "next/image";
import React from "react";
import aboutImage from "@/assets/About Photo.png";

export default function AboutSection() {
  return (
    <section className="px-8 md:px-20 py-20 bg-gray-50">
      {/* Section Title */}
      <h2 className="text-4xl font-semibold text-center text-primary mb-16">
        About Sehha
      </h2>

      {/* Content Wrapper */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* Left - Image */}
        <div className="relative w-full md:w-[587px] h-[391px]">
          <Image
            src={aboutImage}
            alt="About Sehaa"
            fill
            className="object-contain rounded-2xl shadow-md"
            priority
          />
        </div>

        {/* Right - Text */}
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <p className="text-gray-600 leading-relaxed">
            Sehha is a modern healthcare platform that connects patients,
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
