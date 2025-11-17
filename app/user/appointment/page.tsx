"use client";
import Image from "next/image";
import { useState } from "react";

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<string>("May 9, 2025");
  const [selectedTime, setSelectedTime] = useState<string>("10:00");

  const doctor = {
    id: 1,
    name: "Dr. Sarah Hassan",
    specialty: "Cardiologist",
    experienceYears: 5,
    patientsCount: "2.04K",
    reviewsCount: "2.04K",
    image: "/doctor.png", // replace with your real image

    about:
      "Dr. Sarah Hassan, a board-certified Cardiologist with over 8 years of experience in diagnosing and treating a wide range of cardiovascular conditions. She specializes in preventive cardiology, heart failure management, and cardiac imaging, with a strong commitment to providing personalized and evidence-based patient care.",

    location: {
      address: "129, El-Nasr Street, Cairo, Egypt",
      mapImage: "/map.png", // replace
    },

    availableTimes: [
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
    ],

    reviews: [
      {
        id: 1,
        name: "Mariam Khaled",
        time: "50 min ago",
        rating: 4.6,
        comment:
          "Excellent consultation! Dr. Sarah Hassan was very professional and explained everything clearly. The appointment was smooth, and I felt well cared for.",
        image: "/user1.png",
      },
      {
        id: 2,
        name: "Omar Nasser",
        time: "3 days ago",
        rating: 4.8,
        comment:
          "Great experience! Dr. Sarah Hassan was kind, attentive, and knowledgeable. She took the time to listen and gave practical advice for improving my heart health. Definitely recommend!",
        image: "/user2.png",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left card: Doctor info */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow p-6 border">
          <div className="flex flex-col items-center text-center">
            <Image
              src={doctor.image}
              width={120}
              height={120}
              alt={doctor.name}
              className="rounded-full"
            />
            <h2 className="text-2xl font-semibold mt-4">{doctor.name}</h2>
            <p className="text-gray-500">{doctor.specialty}</p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <div className="bg-primary/10 px-4 py-2 rounded-full text-primary">
                👥 {doctor.patientsCount} Patients
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-full text-primary">
                ⭐ {doctor.reviewsCount} Review
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-full text-primary">
                🎓 {doctor.experienceYears} Years
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">About</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {doctor.about}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Location</h3>
            <Image
              src={doctor.location.mapImage}
              width={500}
              height={300}
              alt="map"
              className="rounded-xl w-full mt-3"
            />
            <p className="mt-2 text-gray-700 text-sm">
              {doctor.location.address}
            </p>
          </div>
        </div>

        {/* Right / Middle card: Calendar + times + reviews */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Choose date and time</h3>

          {/* Calendar & Time selection */}
          <div className="border rounded-2xl p-6 flex items-start gap-10">
            <div className="flex-1">
              <p className="text-center font-medium mb-4">May 2025</p>
              <div className="grid grid-cols-7 gap-2 text-center text-gray-500 text-sm">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <p key={d} className="font-semibold">
                    {d}
                  </p>
                ))}

                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === Number(selectedDate.split(" ")[1]);

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(`May ${day}, 2025`)}
                      className={`py-2 rounded-full text-sm ${
                        isSelected
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
                      }`}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-32">
              {doctor.availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`border rounded-lg py-2 text-sm text-center ${
                    selectedTime === time
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-gray-100"
                  }`}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-gray-600 text-sm">
            Your appointment is booked for <b>{selectedDate}</b> at{" "}
            <b>{selectedTime}</b>.
          </p>

          <div className="mt-6 mb-8">
            <button className="bg-primary text-white px-6 py-3 rounded-full">
              Book Now
            </button>
          </div>

          {/* ===== Reviews Section under calendar ===== */}
          <div className="mt-auto">
            <h3 className="text-xl font-semibold mb-4">Reviews and Rating</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctor.reviews.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-2xl p-6 shadow bg-white">
                  <div className="flex items-center gap-4">
                    <Image
                      src={r.image}
                      width={50}
                      height={50}
                      alt={r.name}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-gray-500 text-sm">{r.time}</p>
                    </div>
                    <span className="ml-auto bg-yellow-100 px-3 py-1 rounded-full">
                      ⭐ {r.rating}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-700 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
