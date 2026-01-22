"use client";

import Image, { StaticImageData } from "next/image";
import {
  profile2UserIcon,
  messagesIcon,
  userProfileImage,
} from "@/assets";
import { Doctor } from "@/types/doctors";

interface DoctorInfoCardProps {
  doctor: Doctor;
}

export default function DoctorInfoCard({ doctor }: DoctorInfoCardProps) {
  const cleanName = (name: string) => {
    if (!name) return "";
    return name.split("_")[0];
  };

  const displayName = cleanName(doctor.username);
  const doctorImageUrl = doctor.doctorImage || userProfileImage;

  return (
    <aside className="lg:col-span-1 bg-[#E9F9FA] h-fit border border-primary rounded-2xl shadow p-6">
      <div className="flex flex-col items-center text-center">
        <Image
          src={doctorImageUrl}
          width={120}
          height={120}
          alt={displayName || "Doctor"}
          loading="eager"
          className="rounded-full object-cover"
        />

        <h2 className="text-2xl font-semibold mt-4">{displayName}</h2>
        <p className="text-gray-500">{doctor.specialty}</p>

        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          <StatCard icon={profile2UserIcon} label="Patients" value={doctor.countPatient} />
          <StatCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.5 3.5 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C14.46 5.99 15.96 5 17.5 5 19.5 5 21 6.5 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            } 
            label="Favorites" 
            value={doctor.countFavourite} 
          />
          <StatCard icon={messagesIcon} label="Reviews" value={doctor.countReviews} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3">Location</h3>
        <div className="rounded-xl overflow-hidden">
          <iframe
            src={`https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}&z=15&output=embed`}
            width="100%"
            height="250"
            loading="lazy"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-gray-700 text-sm">
          {doctor.street}, {doctor.city}, {doctor.country}
        </p>
      </div>
    </aside>
  );
}

function StatCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode | StaticImageData; 
  label: string; 
  value: number | string | undefined;
}) {
  return (
    <div className="flex flex-col bg-primary px-4 py-2 rounded-2xl text-white min-w-[90px]">
      <div className="flex flex-row justify-center items-center gap-2 font-bold mb-0.5">
        {icon && typeof icon === "object" && "src" in icon ? (
          <Image src={icon} alt={label} width={20} height={20} loading="eager" />
        ) : (
          icon
        )}
        <span>{value || 0}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider opacity-90">{label}</div>
    </div>
  );
}
