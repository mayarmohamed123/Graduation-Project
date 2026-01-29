import { Doctor } from "@/types";
import Link from "next/link";
import DoctorCard from "../doctor/DoctorCard";

interface TopRatedDoctorsProps {
  doctors: Doctor[];
}

export default function TopRatedDoctors({ doctors }: TopRatedDoctorsProps) {
  if (doctors.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 md:mt-20 pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
          Top Rated Doctors
        </h2>
        <Link href="/user/search-doctors">
          <span className="text-sm text-primary hover:underline cursor-pointer">
            See All
          </span>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

