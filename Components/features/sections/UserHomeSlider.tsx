"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import PrimaryButton from "@/Components/common/PrimaryButton";
import {
  sliderDonate,
  sliderDoctors,
  sliderMedicine,
} from "@/assets";

// Import Swiper styles (handled in globals.css usually, but can be added here if needed)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function UserHomeSlider() {
  const router = useRouter();

  return (
    <div className="w-full max-w-6xl mt-10 min-h-[400px] md:min-h-[280px]">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="pb-10 h-full!">
        {/* Slide 1 */}
        <SwiperSlide className="h-full">
          <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-[#2BBBC5] to-[#D5F4F6] rounded-3xl shadow-md p-8 min-h-[350px] md:min-h-[240px]">
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
              width={300}
              height={300}
              className="mt-6 md:mt-0"
              priority
            />
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide className="h-full">
          <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary to-white rounded-3xl shadow-md p-8 min-h-[350px] md:min-h-[240px]">
            <Image
              src={sliderMedicine}
              alt="Medicines"
              width={200}
              height={200}
              className="mt-6 md:mt-0"
              priority
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
        <SwiperSlide className="h-full">
          <div className="flex flex-col md:flex-row items-center justify-between  bg-linear-to-r from-[#2BBBC5] to-[#D5F4F6] rounded-3xl shadow-md p-8 min-h-[350px] md:min-h-[240px]">
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
              width={200}
              height={200}
              className="mt-6 md:mt-0"
              priority
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
