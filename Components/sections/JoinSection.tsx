import React from "react";
import Doctor from "@/assets/Join 1.png";
import Pharmacy from "@/assets/join 2.png";
import Image from "next/image";

export default function JoinSection() {
  const data = [
    {
      image: Doctor,
      title: "Join as a Doctor",
      description:
        "Reach more patients and grow your practice with Sehha. Manage appointments, consultations, and communication in one secure platform.",
    },
    {
      image: Pharmacy,
      title: "Join as a Pharmacy",
      description:
        "Serve patients faster and expand your reach. Receive and fulfill medicine orders through Sehha’s verified network.",
    },
  ];

  return (
    <section className="px-8 md:px-20 py-20 ">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="heading mb-4">Join Us</h2>
        <p className="paragraph max-w-4xl mx-auto">
          Be part of the Sehha network and help us make healthcare more
          accessible. Whether you’re a doctor or a pharmacy, we provide the
          tools you need to connect with patients effectively.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-12 items-center max-w-4xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col md:flex-row items-center md:items-start w-full max-w-5xl p-0.5 rounded-2xl bg-linear-to-r from-[#95DDFF] to-[#C5ECFF]">
            {/* Inner container with radial gradient */}
            <div className="relative flex flex-col md:flex-row items-center w-full rounded-2xl bg-[radial-gradient(circle_at_top_left,#2BBBC5,#58D2DA)] p-8">
              {/* Image container */}
              <div className="relative w-[220px] h-[220px] shrink-0">
                <div
                  className={`absolute ${
                    index === 1 ? "-top-24" : "-top-[54px]"
                  } -left-[42px]`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={240}
                    height={240}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text and button */}
              <div className="md:ml-12 mt-32 md:mt-0 text-center md:text-left">
                <h3 className="text-xl font-medium text-[#EFF9FF] mb-4">
                  {item.title}
                </h3>
                <p className="text-white mb-6 max-w-md">{item.description}</p>
                <button className="bg-white  text-[#2BBBC5] px-6 py-2 rounded-full font-semibold hover:bg-[#E0F9FA] transition-all">
                  Join Us
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
