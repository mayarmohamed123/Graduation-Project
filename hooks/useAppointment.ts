import { useState, useEffect, useCallback } from "react";
import { doctorService } from "@/Services/doctorService";
import { startConversationWithDoctor } from "@/Services/chatServices";
import { Doctor, Review, AppointmentSlot } from "@/types/doctors";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Helper to format date for API (YYYY-MM-DD)
const formatDateForApi = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useAppointment = (id: string) => {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookLoading, setBookLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  // Initialize with today's date
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);

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

  // Fetch available slots when date changes
  const fetchAvailableSlots = useCallback(async () => {
    if (!id || !selectedDate) return;

    try {
      setSlotsLoading(true);
      const doctorId = parseInt(id, 10);
      if (isNaN(doctorId)) return;

      const formattedDate = formatDateForApi(selectedDate);
      const slots = await doctorService.getDoctorAvailableSlots(doctorId, formattedDate);
      setAvailableSlots(slots);
      
      // Clear selected slot when date changes
      setSelectedSlot(null);
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    if (id) {
      fetchDoctorData();
    }
  }, [id, fetchDoctorData]);

  // Fetch slots when date changes (after doctor is loaded)
  useEffect(() => {
    if (doctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [doctor, selectedDate, fetchAvailableSlots]);

  const bookAppointment = async (patientInfo: {
    PatientName: string;
    PatientPhone: string;
    patientAge: number;
    patientGender: string;
  }) => {
    if (!doctor || !selectedSlot) return;

    try {
      setBookLoading(true);

      const payload = {
        doctorId: doctor.id,
        clinicId: doctor.clinicId,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
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
    slotsLoading,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    availableSlots,
    bookAppointment,
    startDoctorChat,
    refetch: fetchDoctorData,
  };
};
