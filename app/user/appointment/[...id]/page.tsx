"use client";

import Image from "next/image";
import { use, useState } from "react";
import {
  profile2UserIcon,
  messagesIcon,
  userProfileImage,
} from "@/assets";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import DoctorReviews from "@/Components/features/doctor/DoctorReviews";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import PrvButton from "@/Components/common/prvButton";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import PatientInfoDialog from "@/Components/features/appointment/PatientInfoDialog";
import { useAppointment, TIME_SLOTS } from "@/hooks/useAppointment";

export default function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    doctor,
    reviews,
    setReviews,
    isLoading,
    bookLoading,
    chatLoading,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    bookAppointment,
    startDoctorChat
  } = useAppointment(id);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookNowClick = () => {
    setDialogOpen(true);
  };

  const handlePatientInfoSubmit = async (patientInfo: {
    PatientName: string;
    PatientPhone: string;
    patientAge: number;
    patientGender: string;
  }) => {
    try {
      await bookAppointment(patientInfo);
      setDialogOpen(false);
    } catch {
      // Error is handled in the hook (toast)
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Doctor not found</p>
          <p className="text-sm text-gray-500">Invalid doctor ID: {id}</p>
        </div>
      </div>
    );
  }

  const doctorImageUrl = doctor.doctorImage || userProfileImage;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 flex">
        <div className="flex gap-3 items-center w-full">
          <PrvButton />
          <h3 className="text-4xl font-semibold text-gray-900">Doctor</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column: Doctor info */}
        <aside className="lg:col-span-1 bg-[#E9F9FA] h-fit border border-primary rounded-2xl shadow p-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src={doctorImageUrl}
              width={120}
              height={120}
              alt={doctor.username || "Doctor"}
              loading="eager"
              className="rounded-full object-cover"
            />

            <h2 className="text-2xl font-semibold mt-4">{doctor.username}</h2>
            <p className="text-gray-500">{doctor.specialty}</p>

            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {/* Stat Cards */}
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
                border-0
                allowFullScreen></iframe>
            </div>
            <p className="mt-3 text-gray-700 text-sm">
              {doctor.street}, {doctor.city}, {doctor.country}
            </p>
          </div>
        </aside>

        {/* Right column: Booking & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-2xl shadow p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Choose date and time</h3>

            <div className="border rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-1 w-full max-w-[370px]">
                <Calendar
                  mode="single"
                  selected={new Date(selectedDate)}
                  onSelect={(date) => {
                    if (date) {
                      const formatted = date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                      setSelectedDate(formatted);
                    }
                  }}
                  className="rounded-md border shadow w-full aspect-square p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 w-full md:w-36 h-fit">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "border rounded-lg py-2 text-sm text-center transition-all",
                      selectedTime === time
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "hover:bg-gray-50 border-gray-200"
                    )}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-gray-600 text-sm italic">
              Selected appointment: <b>{selectedDate}</b> at <b>{selectedTime}</b>.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
              <button
                onClick={startDoctorChat}
                disabled={chatLoading}
                className="flex items-center gap-2 px-6 py-2.5 border-2 border-primary text-primary rounded-full hover:bg-primary/5 transition disabled:opacity-50 font-medium">
                <MessageCircle className="w-5 h-5" />
                {chatLoading ? "Opening..." : "Message Doctor"}
              </button>
              <Button
                onClick={handleBookNowClick}
                className="bg-primary text-white px-8 py-6 text-lg rounded-full hover:opacity-90 transition shadow-md">
                Book Now
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 md:p-8">
            <DoctorReviews
              doctorId={doctor.id}
              reviews={reviews}
              setReviews={setReviews}
            />
          </div>
        </div>
      </div>

      <PatientInfoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handlePatientInfoSubmit}
        isLoading={bookLoading}
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode | string; label: string; value: number | string | undefined }) {
  return (
    <div className="flex flex-col bg-primary px-4 py-2 rounded-2xl text-white min-w-[90px]">
      <div className="flex flex-row justify-center items-center gap-2 font-bold mb-0.5">
        {typeof icon === "string" ? (
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
