"use client";

import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { MessageCircle, Loader2 } from "lucide-react";
import { AppointmentSlot } from "@/types/doctors";

interface BookingSectionProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSlot: AppointmentSlot | null;
  setSelectedSlot: (slot: AppointmentSlot) => void;
  availableSlots: AppointmentSlot[];
  slotsLoading?: boolean;
  onBookNow: () => void;
  onMessageDoctor: () => void;
  chatLoading?: boolean;
}

// Helper to format time from ISO string
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function BookingSection({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  availableSlots,
  slotsLoading = false,
  onBookNow,
  onMessageDoctor,
  chatLoading = false,
}: BookingSectionProps) {
  // Filter only active slots
  const activeSlots = availableSlots.filter((slot) => slot.isActive);

  return (
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

        <div className="w-full md:w-48">
          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading slots...</span>
            </div>
          ) : activeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No available slots for this date.</p>
              <p className="text-sm mt-1">Please select another date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {activeSlots.map((slot) => {
                const timeLabel = formatTime(slot.startAt);
                const isSelected = selectedSlot?.startAt === slot.startAt;
                
                return (
                  <button
                    key={slot.startAt}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "border rounded-lg py-2 text-sm text-center transition-all",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    {timeLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedSlot && (
        <p className="mt-4 text-gray-600 text-sm italic">
          Selected appointment: <b>{selectedDate}</b> at{" "}
          <b>{formatTime(selectedSlot.startAt)} - {formatTime(selectedSlot.endAt)}</b>.
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
        <button
          onClick={onMessageDoctor}
          disabled={chatLoading}
          className="flex items-center gap-2 px-6 py-2.5 border-2 border-primary text-primary rounded-full hover:bg-primary/5 transition disabled:opacity-50 font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          {chatLoading ? "Opening..." : "Message Doctor"}
        </button>
        <Button
          onClick={onBookNow}
          disabled={!selectedSlot}
          className="bg-primary text-white px-8 py-6 text-lg rounded-full hover:opacity-90 transition shadow-md disabled:opacity-50"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
