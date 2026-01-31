"use client";

import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import DoctorReviews from "@/components/features/doctor/DoctorReviews";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PrvButton from "@/components/common/prvButton";
// import PatientInfoDialog from "@/Components/features/appointment/PatientInfoDialog";
import DoctorInfoCard from "@/components/features/appointment/DoctorInfoCard";
import BookingSection from "@/components/features/appointment/BookingSection";
import { useAppointment } from "@/hooks/useAppointment";

export default function AppointmentPage({ params }: { params: Promise<{ id: string[] }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id[0];

  const {
    doctor,
    isLoading,
    reviews,
    setReviews,
    selectedDate,
    selectedSlot,
    setSelectedDate,
    setSelectedSlot,
    availableSlots,
    slotsLoading,
    chatLoading,
    startDoctorChat
  } = useAppointment(id);

  const router = useRouter();

  const handleBookNowClick = () => {
    if (!doctor || !selectedSlot) return;

    // Merge selectedDate (YYYY-MM-DD) with the time portion of startAt/endAt (e.g. T11:30:00)
    const mergeDateTime = (dateStr: string, isoStr: string) => {
      const timePart = isoStr.split("T")[1];
      return `${dateStr}T${timePart}`;
    };

    const startTime = mergeDateTime(selectedDate, selectedSlot.startAt);
    const endTime = mergeDateTime(selectedDate, selectedSlot.endAt);

    const params = new URLSearchParams({
      doctorId: doctor.id.toString(),
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
    });

    router.push(`/user/appointment/summary?${params.toString()}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!doctor) return <div className="text-center py-10">Doctor not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      <PrvButton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Doctor Info */}
        <div className="lg:col-span-1 h-fit">
          <DoctorInfoCard
            doctor={doctor}
          />
        </div>

        {/* Right Column: Booking & Reviews */}
        <div className="lg:col-span-2 space-y-8">
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

          <Suspense fallback={<LoadingSpinner />}>
            <DoctorReviews
              doctorId={doctor.id}
              reviews={reviews}
              setReviews={setReviews}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
