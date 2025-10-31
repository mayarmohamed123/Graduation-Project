import Image from "next/image";
import React from "react";
import WorkImage from "@/assets/work section.png";

export default function WorkSection() {
  const steps = [
    {
      number: 1,
      title: "Sign Up & Create Your Profile",
      description:
        "Sign up on the Sehha website in minutes. Add your basic details to personalize your healthcare experience.",
    },
    {
      number: 2,
      title: "Search for Services",
      description:
        "Find doctors, pharmacies, or blood donors near you — all from one place.",
    },
    {
      number: 3,
      title: "Book, Order, or Connect",
      description:
        "Schedule appointments, order medicines, or request blood with just a few taps.",
    },
    {
      number: 4,
      title: "Get Real-Time Updates",
      description:
        "Receive confirmations, reminders, and status updates directly in the app.",
    },
  ];

  return (
    <section className="px-8 md:px-20 py-20 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="heading mb-4">How It Works</h2>
        <p className="paragraph max-w-6xl mx-auto">
          Navigating your healthcare journey with Sehha is seamless. Just follow
          these steps mentioned below to proceed with your selected services.
          You can also see our FAQ section for more guidance:
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div className="flex flex-col items-start relative">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start mb-10 relative">
              {/* Vertical dashed line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-6 top-12 h-full border-l-2 border-dashed border-[#2BBBC5] z-0"></div>
              )}

              {/* Number Circle */}
              <div className="relative z-10 flex flex-col items-center mr-6">
                <div className="w-13 h-13 flex items-center justify-center rounded-full bg-linear-to-r from-[#B2E8EC] to-[#53CED6] text-white font-bold text-3xl shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Step Text */}
              <div>
                <h3 className="paragraph mb-2">{step.title}</h3>
                <p className="text-[#6D6D6D] w-[334px]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center">
          <Image
            src={WorkImage}
            alt="How it works illustration"
            width={500}
            height={500}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
