import Link from "next/link";
import Image from "next/image";
import {
  doctorsCardImage,
  medicineCardImage,
  donateCardImage,
} from "@/assets";

import TopRatedDoctors from "@/Components/features/sections/TopRatedDoctors";
import TopRatedPharmacies from "@/Components/features/sections/TopRatedPharmacies";
import HomeMapSection from "@/Components/features/sections/HomeMapSection";
import PrimaryButton from "@/Components/common/PrimaryButton";
import UserLocationManager from "@/Components/features/sections/UserLocationManager";
import UserWelcomeHeader from "@/Components/features/sections/UserWelcomeHeader";
import UserHomeSlider from "@/Components/features/sections/UserHomeSlider";
import { doctorService } from "@/Services/doctorService";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { Doctor, Pharmacy } from "@/types";

export default async function Page() {
  // Fetch data for Map on the server
  let doctors: Doctor[] = [];
  let pharmacies: Pharmacy[] = [];
  try {
    const [doctorsData, pharmaciesData] = await Promise.all([
      doctorService.getAllDoctors(),
      pharmacyService.getPharmacies(),
    ]);
    doctors = doctorsData;
    pharmacies = Array.isArray(pharmaciesData) ? pharmaciesData : [];
  } catch (error) {
    console.error("Dashboard server-side fetch failed:", error);
  }

  const actionCards = [
    {
      id: 1,
      title: "Find a Doctor",
      description: "Search and book trusted specialists near you.",
      image: doctorsCardImage,
      alt: "Find a Doctor",
      href: "/user/search-doctors",
      buttonText: "Find Now",
    },
    {
      id: 2,
      title: "Order Medicine",
      description: "Get your prescriptions delivered fast and safely.",
      image: medicineCardImage,
      alt: "Order Medicine",
      href: "/user/search-medicine",
      buttonText: "Order Now",
    },
    {
      id: 3,
      title: "Donate Blood",
      description: "Save lives and support your community.",
      image: donateCardImage,
      alt: "Donate Blood",
      href: "/user/donation",
      buttonText: "Donate Now",
    },
  ];

  return (
    <div>
      {/* Headless Location Manager */}
      <UserLocationManager />

      {/* Hero Section */}
      <section className="min-h-screen bg-white flex flex-col items-center justify-center py-8 px-4">
        <div className="max-w-4xl w-full">
          <UserWelcomeHeader />

          <p className="text-[#8E8E8E] text-lg mb-10 text-center">
            Take care of your health today, explore trusted doctors, order
            medicines, or help others by donating blood.
          </p>
        </div>

        {/* --- Slider Section --- */}
        <UserHomeSlider />
      </section>

      {/* Card section */}
      <section className="w-full max-w-6xl mx-auto mt-10 pb-10 px-4 ">
        <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center sm:text-left">
          What Would You Like to Do Today?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {actionCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#2BBBC5] shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src={card.image}
                alt={card.alt}
                className="w-full h-56 object-cover"
                priority
              />
              <div className="p-6">
                <h3 className="text-[#2BBBC5] text-2xl font-medium mb-2">
                  {card.title}
                </h3>
                <p className="text-[#8E8E8E] text-sm mb-4">
                  {card.description}
                </p>
                <Link href={card.href} className="block w-full">
                  <PrimaryButton fullWidth>
                    {card.buttonText}
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Pharmacies */}
      <TopRatedPharmacies />

      {/* Top Rated Doctors */}
      <TopRatedDoctors />

      {/* Map Section */}
      <HomeMapSection doctors={doctors} pharmacies={pharmacies} />
    </div>
  );
}

