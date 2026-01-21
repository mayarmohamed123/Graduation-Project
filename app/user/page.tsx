"use client";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  sliderDonate,
  sliderDoctors,
  sliderMedicine,
  doctorsCardImage,
  medicineCardImage,
  donateCardImage,
} from "@/assets";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import TopRatedDoctors from "@/Components/features/sections/TopRatedDoctors";
import HomeMapSection from "@/Components/features/sections/HomeMapSection";
import PrimaryButton from "@/Components/common/PrimaryButton";
import { useLocation } from "@/hooks/useLocation";

export default function Page() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  useLocation();

  const userName = user?.userName;

  const actionCards = [
    {
      id: 1,
      title: "Find a Doctor",
      description: "Search and book trusted specialists near you.",
      image: doctorsCardImage,
      alt: "Find a Doctor",
      buttonText: "Find Now",
      buttonBg: "#2BBBC5",
      buttonHover: "#25a4ac",
    },
    {
      id: 2,
      title: "Order Medicine",
      description: "Get your prescriptions delivered fast and safely.",
      image: medicineCardImage,
      alt: "Order Medicine",
      buttonText: "Order Now",
      buttonBg: "#2BBBC5",
      buttonHover: "#25a4ac",
    },
    {
      id: 3,
      title: "Donate Blood",
      description: "Save lives and support your community.",
      image: donateCardImage,
      alt: "Donate Blood",
      buttonText: "Donate Now",
      buttonBg: "#2BBBC5",
      buttonHover: "#25a4ac",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-4xl w-full">
          {/* Header with Logout */}

          <h1 className="heading text-center">
            Welcome back, {isLoading ? "..." : (userName || "User")}!👋
          </h1>

          <p className="text-[#8E8E8E] text-lg mb-10 text-center">
            Take care of your health today ,explore trusted doctors, order
            medicines, or help others by donating blood.
          </p>
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
            className="pb-10 ">
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
                  <PrimaryButton variant="secondary" onClick={() => router.push("/user/search-doctors")}>
                    Find a Doctor
                  </PrimaryButton>
                </div>
                <Image
                  src={sliderDoctors}
                  alt="Doctors"
                  width={400}
                  height={400}
                  className="mt-6 md:mt-0"
                />
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary to-white rounded-3xl shadow-md p-8">
                <Image
                  src={sliderMedicine}
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
                  <PrimaryButton onClick={() => router.push("/user/search-medicine")}>
                    Order Now
                  </PrimaryButton>
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
                  <PrimaryButton variant="secondary" onClick={() => router.push("/user/donation")}  >
                    Donate Now
                  </PrimaryButton>
                </div>
                <Image
                  src={sliderDonate}
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
                priority
              />
              <div className="p-6">
                <h3 className="text-[#2BBBC5] text-2xl font-medium mb-2">
                  {card.title}
                </h3>
                <p className="text-[#8E8E8E] text-sm mb-4">
                  {card.description}
                </p>
                <PrimaryButton fullWidth
                  onClick={() => {
                    if (card.id === 1) {
                      router.push("/user/search-doctors");
                    } else if (card.id === 2) {
                      router.push("/user/search-medicine");
                    } else if (card.id === 3) {
                      router.push("/user/donation");
                    }
                  }}>
                  {card.buttonText}
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Reated */}
      <TopRatedDoctors />

      {/* Map Section */}
      <HomeMapSection />
    </div>
  );
}
