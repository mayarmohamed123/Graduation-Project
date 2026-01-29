"use client";

import { use, useState, Suspense } from "react";
import DoctorReviews from "@/components/features/doctor/DoctorReviews";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PrvButton from "@/components/common/prvButton";
import PatientInfoDialog from "@/components/features/appointment/PatientInfoDialog";
import DoctorInfoCard from "@/components/features/appointment/DoctorInfoCard";
import BookingSection from "@/components/features/appointment/BookingSection";
import { useAppointment } from "@/hooks/useAppointment";

function AppointmentContent({
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
    slotsLoading,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    availableSlots,
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex">
        <div className="flex gap-3 items-center w-full">
          <PrvButton />
          <h3 className="text-4xl font-semibold text-gray-900">Doctor</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column: Doctor info */}
        <DoctorInfoCard doctor={doctor} />

        {/* Right column: Booking & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          <BookingSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            availableSlots={availableSlots}
            slotsLoading={slotsLoading}
            onBookNow={handleBookNowClick}
            onMessageDoctor={startDoctorChat}
            chatLoading={chatLoading}
          />

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

export default function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <LoadingSpinner />
      </div>
    }>
      <AppointmentContent params={params} />
    </Suspense>
  );
}
