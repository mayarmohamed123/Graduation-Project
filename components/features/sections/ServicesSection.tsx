import React from "react";
import {
  doctorServiceIcon,
  pharmacyServiceIcon,
  bloodServiceIcon,
  secureServiceIcon,
} from "@/assets";
import Image from "next/image";
import WaveLines from "@/components/features/WaveLines";

export default function ServicesSection() {
  const services = [
    {
      icon: doctorServiceIcon,
      title: "Find Doctors Nearby",
      firstText: "Connect instantly with qualified doctors near you.",
      secondText: "Book appointments anytime, anywhere.",
    },
    {
      icon: pharmacyServiceIcon,
      title: "Find & Order Medicines",
      firstText: "Locate specific medicines in pharmacies near you.",
      secondText: "Place orders online for fast and secure delivery.",
    },
    {
      icon: bloodServiceIcon,
      title: "Donate or Request Blood",
      firstText: "Find or donate blood in emergencies.",
      secondText: " Join a caring community that saves lives.",
    },
    {
      icon: secureServiceIcon,
      title: "Secure Communication",
      firstText: "Chat safely with doctors and pharmacists.",
      secondText: "Your health data stays private and protected.",
    },
  ];
  return (
    <section
      id="services"
      className="px-8 md:px-20 py-20 bg-white max-w-7xl mx-auto relative">
      {/* Wave decorations - hidden on mobile */}
      <WaveLines top="218px" left="30px" className="mb-5 hidden lg:block" />
      <WaveLines top="607px" left="1183px" className="mt-1 hidden lg:block" />
      {/* Heading */}
      <div className="text-center mb-20">
        <h2 className="heading">Top Services We Offer</h2>
        <p className="paragraph">
          In today&apos;s fast-moving world, your health deserves care that&apos;s both
          accessible and convenient. That&apos;s why Healing brings together a suite of
          digital healthcare services designed to connect you with doctors,
          pharmacies, and donors — all in one trusted platform.
        </p>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-xl border border-primary h-auto md:h-[297px] hover:shadow-lg transition-shadow">
            <div className="bg-white rounded-2xl p-6 h-full flex flex-col items-center text-left">
              <Image
                src={service.icon}
                alt={service.title}
                width={80}
                height={80}
                className="mb-4"
              />
              <h3 className="text-xl font-medium text-[#2BBBC5] mb-3">
                {service.title}
              </h3>
              <p className="text-[#8E8E8E] mb-1">{service.firstText}</p>
              <p className="text-[#8E8E8E] mb-2">{service.secondText}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
