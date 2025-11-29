"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import type { Appointment } from "@/types";
import { userService } from "@/Services/userService";
import { toast } from "react-hot-toast";
import { formatDate, formatTime } from "@/lib/dateUtils";

type TabType = "pending" | "completed" | "cancelled";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await userService.getUserAppointments();
        console.log(data);
        setAppointments(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load appointments"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filterAppointments = (tab: TabType) => {
    return appointments.filter((appointment) => {
      const statusLower = appointment.status.toLowerCase();

      if (tab === "pending") {
        return statusLower === "pending";
      } else if (tab === "completed") {
        return statusLower === "completed" || statusLower === "confirmed";
      } else if (tab === "cancelled") {
        return statusLower === "cancelled" || statusLower === "canceled";
      }
      return false;
    });
  };

  const filteredAppointments = filterAppointments(activeTab);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") {
      return (
        <span className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          Pending
        </span>
      );
    } else if (statusLower === "confirmed") {
      return (
        <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Confirmed
        </span>
      );
    } else if (statusLower === "completed") {
      return (
        <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Completed
        </span>
      );
    } else if (statusLower === "cancelled" || statusLower === "canceled") {
      return (
        <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Cancelled
        </span>
      );
    }
    return null;
  };

  const AppointmentCard = ({
    appointment,
    showButtons = true,
  }: {
    appointment: Appointment;
    showButtons?: boolean;
  }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {/* Doctor Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {appointment.doctorImage ? (
            <Image
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-xl">
              {appointment.doctorName.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Appointment Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {appointment.doctorName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {appointment.doctorSpeciality}
              </p>
              <p className="text-sm text-gray-500">{appointment.clinicName}</p>
            </div>

            {/* Message Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <MessageCircle className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Date, Time, Status */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appointment.startAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(appointment.startAt)}</span>
            </div>
            {getStatusBadge(appointment.status)}
          </div>

          {/* Action Buttons */}
          {showButtons && (
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
              <button className="flex-1 px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition">
                Reschedule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Appointments</h1>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Appointments</h1>

      {/* Tab Filters */}
      <div className="flex gap-3 mb-8 bg-gray-100 p-2 rounded-full justify-evenly transition-all ">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-16 py-3 rounded-full font-medium transition ${
            activeTab === "pending"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}>
          Pending
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-16 py-3 rounded-full font-medium transition ${
            activeTab === "completed"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}>
          Completed
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`px-16 py-3 rounded-full font-medium transition ${
            activeTab === "cancelled"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}>
          Canceled
        </button>
      </div>

      {/* Content */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">
            No {activeTab} appointments found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              showButtons={activeTab === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
