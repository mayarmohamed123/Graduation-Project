import { appointmentService } from "@/Services/appointmentServices";
import toast from "react-hot-toast";

export const useAppointmentActions = (onSuccess?: () => void) => {
  // Handle Accept Appointment
  const handleAccept = async (appointmentId: string) => {
    try {
      await appointmentService.acceptAppointment(appointmentId);
      toast.success("Appointment accepted successfully!");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to accept appointment";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  // Handle Reject Appointment
  const handleReject = async (appointmentId: string) => {
    try {
      await appointmentService.rejectAppointment(appointmentId);
      toast.success("Appointment rejected");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject appointment";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  // Handle Complete Appointment
  const handleComplete = async (appointmentId: string) => {
    try {
      await appointmentService.completeAppointment(appointmentId);
      toast.success("Appointment marked as completed");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to complete appointment";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  return {
    handleAccept,
    handleReject,
    handleComplete,
  };
};
