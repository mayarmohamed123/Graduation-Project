import { useState, useEffect, useCallback } from "react";
import { doctorService } from "@/Services/doctorService";
import { startConversationWithDoctor } from "@/Services/chatServices";
import { Doctor, Review } from "@/types/doctors";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
];

export const useAppointment = (id: string) => {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookLoading, setBookLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("May 9, 2025");
  const [selectedTime, setSelectedTime] = useState<string>("10:00");

  const fetchDoctorData = useCallback(async () => {
    try {
      setIsLoading(true);
      const doctorId = parseInt(id, 10);
      if (isNaN(doctorId)) {
        throw new Error("Invalid doctor ID");
      }

      const [doctorData, reviewData] = await Promise.all([
        doctorService.getDoctorById(doctorId),
        doctorService.GetDoctorReviews(doctorId),
      ]);

      setDoctor(doctorData);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (error) {
      console.error("Failed to load doctor data:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load doctor data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDoctorData();
    }
  }, [id, fetchDoctorData]);

  const bookAppointment = async (patientInfo: {
    PatientName: string;
    PatientPhone: string;
    patientAge: number;
    patientGender: string;
  }) => {
    if (!doctor) return;

    try {
      setBookLoading(true);

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
        PatientName: patientInfo.PatientName,
        PatientPhone: patientInfo.PatientPhone,
        patientAge: patientInfo.patientAge,
        patientGender: patientInfo.patientGender,
      };

      // 1. Book the appointment
      const bookingResponse = await doctorService.bookAppointmentInClinic(payload);

      // 2. Create the payment session
      const sessionResponse = await doctorService.createPaymentSession(
        bookingResponse.appointment.id
      );

      // 3. Redirect to Stripe checkout
      window.location.href = sessionResponse.sessionUrl;

    } catch (err) {
      console.error("Failed to book appointment:", err);
      toast.error(err instanceof Error ? err.message : "Failed to book appointment");
      throw err; // Re-throw to handle in component if needed
    } finally {
      setBookLoading(false);
    }
  };

  const startDoctorChat = async () => {
    if (!doctor) return;

    try {
      setChatLoading(true);
      const thread = await startConversationWithDoctor(doctor.id.toString());
      router.push(`/user/chat?threadId=${thread.id}`);
      toast.success("Opening chat with doctor...");
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start chat");
    } finally {
      setChatLoading(false);
    }
  };

  return {
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
    startDoctorChat,
    refetch: fetchDoctorData,
  };
};
