"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { use } from "react";
import Patients from "@/assets/profile-2user.svg";
import Reviews from "@/assets/messages.svg";
import { Calendar, LoadingSpinner } from "@/Components";
import { cn } from "@/lib/utils";
import PrvButton from "@/Components/shared/prvButton";
import { doctorService } from "@/Services/doctorService";
import { Doctor, Review } from "@/types/doctors";
import textImage from "@/assets/user-profile.webp";

export default function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("May 9, 2025");
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorId = parseInt(id, 10);

        if (isNaN(doctorId)) {
          throw new Error("Invalid doctor ID");
        }

        const doctorData = await doctorService.getDoctorById(doctorId);
        setDoctor(doctorData);

        const reviewData = await doctorService.GetDoctorReviews(doctorId);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (error) {
        console.error("Failed to load doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  if (loading) {
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

  // ===== IMAGE FALLBACK =====
  const doctorImageUrl = doctor.doctorImage
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${doctor.doctorImage}`
    : textImage;

  const handleBooking = async () => {
    try {
      if (!doctor) return;

      const date = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");

      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));

      const startAt = date.toISOString();

      const endDate = new Date(date.getTime() + 30 * 60000);
      const endAt = endDate.toISOString();

      const payload = {
        doctorId: doctor.id,
        clinicId: doctor.clinicId,
        startAt,
        endAt,
      };

      const response = await doctorService.bookAppointmentInClinic(payload);
      alert(response.message);
    } catch (err: Error) {
      alert(err.message || "Failed to book appointment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 flex">
        <div className="flex gap-3 items-center w-full">
          <PrvButton />
          <h3 className="text-4xl font-semibold text-gray-900">Doctor</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left card: Doctor info */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow p-6 border">
          <div className="flex flex-col items-center text-center">
            {/* DOCTOR IMAGE WITH FALLBACK */}
            <Image
              src={doctorImageUrl}
              width={120}
              height={120}
              alt={doctor.username || "Doctor"}
              priority
              className="rounded-full object-cover"
            />

            <h2 className="text-2xl font-semibold mt-4">{doctor.username}</h2>
            <p className="text-gray-500">{doctor.specialty}</p>

            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {/* Patients */}
              <div className="flex flex-col bg-[#2BBBC5] px-4 py-2 rounded-2xl text-white">
                <div className="flex flex-row gap-2 font-bold">
                  <Image
                    src={Patients}
                    alt="patients"
                    width={24}
                    height={24}
                    priority
                  />
                  {doctor.countPatient}
                </div>
                <div className="text-sm">Patients</div>
              </div>

              {/* Favorites */}
              <div className="flex flex-col bg-[#2BBBC5] px-4 py-2 rounded-2xl text-white">
                <div className="flex flex-row gap-2 font-bold">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.5 3.5 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C14.46 5.99 15.96 5 17.5 5 19.5 5 21 6.5 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {doctor.countFavourite || 0}
                </div>
                <div className="text-sm">Favorites</div>
              </div>

              {/* Reviews */}
              <div className="flex flex-col bg-[#2BBBC5] px-4 py-2 rounded-2xl text-white">
                <div className="flex flex-row gap-2 font-bold">
                  <Image
                    src={Reviews}
                    alt="review"
                    width={24}
                    height={24}
                    priority
                  />
                  {doctor.countReviews || 0}
                </div>
                <div className="text-sm">Reviews</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Location</h3>
            <iframe
              src={`https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}&z=15&output=embed`}
              width="100%"
              height="300"
              loading="lazy"
              className="rounded-xl w-full mt-3 border-0"
              allowFullScreen></iframe>
            <p className="mt-2 text-gray-700 text-sm">
              {doctor.street}, {doctor.city}, {doctor.country}
            </p>
          </div>
        </div>

        {/* Right / Middle card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Choose date and time</h3>

          <div className="border rounded-2xl p-6 flex items-start gap-10">
            <div className="flex-1">
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
                className="rounded-md border shadow w-[370px] h-[425px] p-3"
              />
            </div>

            <div className="flex flex-col gap-2 w-32">
              {[
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "14:00",
                "14:30",
              ].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "border rounded-lg py-2 text-sm text-center",
                    selectedTime === time
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-gray-100"
                  )}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-gray-600 text-sm">
            Your appointment is booked for <b>{selectedDate}</b> at{" "}
            <b>{selectedTime}</b>.
          </p>

          <div className="mt-6 mb-8 text-end">
            <button
              onClick={handleBooking}
              className="bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition">
              Book Now
            </button>
          </div>

          {/* REVIEWS */}
          <div className="mt-auto">
            <h3 className="text-xl text-primary font-semibold mb-4">
              Reviews and Rating ({reviews.length})
            </h3>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => {
                  const reviewImageUrl = review.image
                    ? `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${review.image}`
                    : textImage;

                  return (
                    <div
                      key={review.id}
                      className="border rounded-2xl p-6 shadow bg-white">
                      <div className="flex items-center gap-4">
                        {/* REVIEW IMAGE WITH FALLBACK */}
                        <Image
                          src={reviewImageUrl}
                          width={50}
                          height={50}
                          alt={review.userName || "User"}
                          priority
                          className="rounded-full object-cover"
                        />

                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="text-gray-500 text-sm">
                            {review.userEmail}
                          </p>
                        </div>

                        <span className="ml-auto bg-yellow-100 px-3 py-1 rounded-full text-sm">
                          {review.rating}
                        </span>
                      </div>

                      <p className="mt-4 text-gray-700 text-sm">
                        {review.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
