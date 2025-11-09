import React from "react";
import Doctor from "@/assets/Frame 5.svg";
import Pharmacy from "@/assets/Frame 5 (1).svg";
import Blood from "@/assets/Frame 5 (2).svg";
import secure from "@/assets/Frame 5 (3).svg";
import Image from "next/image";

export default function ServicesSection() {
  const services = [
    {
      icon: Doctor,
      title: "Find Doctors Nearby",
      firstText: "Connect instantly with qualified doctors near you.",
      secondText: "Book appointments anytime, anywhere.",
    },
    {
      icon: Pharmacy,
      title: "Order Medicines Online",
      firstText: "Order prescriptions and health supplies easily.",
      secondText: "Fast delivery from verified pharmacies.",
    },
    {
      icon: Blood,
      title: "Donate or Request Blood",
      firstText: "Find or donate blood in emergencies.",
      secondText: " Join a caring community that saves lives.",
    },
    {
      icon: secure,
      title: "Secure Communication",
      firstText: "Chat safely with doctors and pharmacists.",
      secondText: "Your health data stays private and protected.",
    },
  ];
  return (
    <section className="px-8 md:px-20 py-20 bg-white max-w-8xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="heading">Top Services We Offer</h2>
        <p className="paragraph">
          In today’s fast-moving world, your health deserves care that’s both
          accessible and convenient. That’s why Sehha brings together a suite of
          digital healthcare services designed to connect you with doctors,
          pharmacies, and donors — all in one trusted platform.
        </p>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-0.5 rounded-xl bg-linear-to-r from-[#A8E7EB] to-[#58D2DA] h-[297px] hover:shadow-lg transition-shadow">
            <div className="bg-white rounded-2xl p-6 h-full flex flex-col items-center text-left">
              <Image
                src={service.icon}
                alt={service.title}
                width={80}
                height={80}
                className="mb-4"
              />
              <h3 className="text-2xl font-medium text-[#2BBBC5] mb-3">
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
