"use client";
import React, { useState } from "react";
import Image from "next/image";
import donate from "@/assets/slider/donate.svg";
import doctors from "@/assets/slider/doctors.svg";
import medicine from "@/assets/slider/medicine.svg";
import vector from "@/assets/Vector.svg";
import doctorsCard from "@/assets/cards/unsplash_w46dSjqUUxM.svg";
import medicineCard from "@/assets/cards/unsplash_w46dSjqUUxM (1).svg";
import donateCard from "@/assets/cards/unsplash_w46dSjqUUxM (2).svg";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Page() {
  const actionCards = [
    {
      id: 1,
      title: "Find a Doctor",
      description: "Search and book trusted specialists near you.",
      image: doctorsCard,
      alt: "Find a Doctor",
      buttonText: "Find Now",
      buttonBg: "#2BBBC5",
      buttonHover: "#25a4ac",
    },
    {
      id: 2,
      title: "Order Medicine",
      description: "Get your prescriptions delivered fast and safely.",
      image: medicineCard,
      alt: "Order Medicine",
      buttonText: "Order Now",
      buttonBg: "#2BBBC5",
      buttonHover: "#25a4ac",
    },
    {
      id: 3,
      title: "Donate Blood",
      description: "Save lives and support your community.",
      image: donateCard,
      alt: "Donate Blood",
      buttonText: "Donate Now",
      buttonBg: "#2BBBC5",
      buttonHover: "#25a4ac",
    },
  ];
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-4xl text-center">
          <h1 className="heading">Welcome back, Nourhan !👋</h1>
          <p className="text-[#8E8E8E] text-lg mb-10">
            Take care of your health today ,explore trusted doctors, order
            medicines, or help others by donating blood.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex items-center justify-center mb-12">
            <div className="relative flex w-full max-w-4xl border border-[#2BBBC5] rounded-full overflow-hidden shadow-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for doctors, pharmacies, or blood donors"
                className="w-full px-4 py-2 outline-none text-gray-700"
              />
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <Image src={vector} alt="search icon" width={20} height={20} />
              </div>
            </div>
          </form>
        </div>

        {/* --- Slider Section --- */}
        <div className="w-full max-w-6xl mt-10">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 4000 }}
            loop
            className="pb-10">
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-[#2BBBC5] to-[#D5F4F6] rounded-3xl shadow-md p-8">
                <div className="max-w-md py-5">
                  <h2 className="text-2xl font-medium text-white mb-2">
                    Find Trusted Doctors Near You
                  </h2>
                  <p className="font-normal text-white mb-4">
                    Book appointments with verified specialists in just a few
                    clicks.
                  </p>
                  <button className="bg-[#2BBBC5] text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-all">
                    Find a Doctor
                  </button>
                </div>
                <Image
                  src={doctors}
                  alt="Doctors"
                  width={400}
                  height={400}
                  className="mt-6 md:mt-0"
                />
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-primary to-white rounded-3xl shadow-md p-8">
                <Image
                  src={medicine}
                  alt="Medicines"
                  width={300}
                  height={300}
                  className="mt-6 md:mt-0"
                />

                <div className="max-w-md">
                  <h2 className="text-2xl font-medium text-[#259FA7] mb-2">
                    Order Medicines Easily & Securely
                  </h2>
                  <p className="font-normal text-[#259FA7] mb-4">
                    Fast delivery from verified pharmacies — your health, your
                    convenience.
                  </p>
                  <button className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-all">
                    Order Now
                  </button>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center justify-between  bg-linear-to-r from-[#2BBBC5] to-[#D5F4F6] rounded-3xl shadow-md p-8">
                <div className="max-w-md">
                  <h2 className="text-2xl font-medium text-white mb-2">
                    Save Lives. Donate Blood Today.
                  </h2>
                  <p className="font-normal text-white mb-4">
                    Join the Sehha community and make a real difference.
                  </p>
                  <button className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-all">
                    Donate Now
                  </button>
                </div>
                <Image
                  src={donate}
                  alt="Donate Blood"
                  width={300}
                  height={300}
                  className="mt-6 md:mt-0"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Card section */}
      <section className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#2BBBC5] mb-10">
          What Would You Like to Do Today?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {actionCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#2BBBC5] shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src={card.image}
                alt={card.alt}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-[#2BBBC5] text-2xl font-medium mb-2">
                  {card.title}
                </h3>
                <p className="text-[#8E8E8E] text-sm mb-4">
                  {card.description}
                </p>
                <button className="bg-[#2BBBC5] text-white px-6 py-2 rounded-full hover:bg-[#25a4ac] transition-all">
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accord */}
    </div>
  );
}
