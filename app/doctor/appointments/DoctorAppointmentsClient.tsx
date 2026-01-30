"use client";

import StatisticsCard from "@/components/features/doctor/StatisticsCard";
import AppointmentCard from "@/components/features/doctor/AppointmentCard";
import React, { useState } from "react";
import {
    Search,
    Calendar,
    ChevronDown,
    Clock,
    CheckCircle2,
    XCircle,
    CheckCircle,
    Plus,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentInfo, AppointmentStats } from "@/types/appointments";
import { useAppointmentActions } from "@/hooks/useAppointmentActions";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { doctorService } from "@/Services/doctorService";
import { DoctorAvailability, CreateAvailabilityData, UpdateAvailabilityData } from "@/types/doctors";
import { AvailabilityList } from "@/components/features/doctor/appointments/AvailabilityList";
import { AvailabilityForm } from "@/components/features/doctor/appointments/AvailabilityForm";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface DoctorAppointmentsClientProps {
  initialData: {
    stats: AppointmentStats | null;
    appointments: AppointmentInfo[];
  };
}

export default function DoctorAppointmentsClient({ initialData }: DoctorAppointmentsClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All Status");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Availability State
    const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
    const [isLoadingAvailabilities, setIsLoadingAvailabilities] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState<DoctorAvailability | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState<number | null>(null);

    const fetchAvailabilities = useCallback(async () => {
        try {
            setIsLoadingAvailabilities(true);
            const data = await doctorService.getMyAvailabilities();
            setAvailabilities(data);
        } catch (error) {
            console.error("Failed to fetch availabilities:", error);
            toast.error("Failed to load your working hours");
        } finally {
            setIsLoadingAvailabilities(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailabilities();
    }, [fetchAvailabilities]);

    const handleFormSubmit = async (data: CreateAvailabilityData | UpdateAvailabilityData) => {
        try {
            setIsSubmitting(true);
            if (editingSlot) {
                const res = await doctorService.updateAvailability(editingSlot.id, data as UpdateAvailabilityData);
                toast.success(res.message || "Availability updated successfully");
            } else {
                const res = await doctorService.addAvailability(data as CreateAvailabilityData);
                toast.success(res.message || "Availability added successfully");
            }
            setIsFormOpen(false);
            setEditingSlot(null);
            fetchAvailabilities();
        } catch (error) {
            console.error("Failed to save availability:", error);
            const message = error instanceof Error ? error.message : "Failed to save availability";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setSlotToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!slotToDelete) return;
        try {
            setIsDeletingId(slotToDelete);
            const res = await doctorService.deleteAvailability(slotToDelete);
            toast.success(res.message || "Availability removed");
            fetchAvailabilities(); // Refetch the list
            setDeleteDialogOpen(false);
            setSlotToDelete(null);
        } catch (error) {
            console.error("Failed to delete availability:", error);
            toast.error("Failed to remove availability");
        } finally {
            setIsDeletingId(null);
        }
    };

    const handleEditClick = (slot: DoctorAvailability) => {
        setEditingSlot(slot);
        setIsFormOpen(true);
    };

    const { stats, appointments } = initialData;
    const statusOptions = ['All Status', 'Pending', 'Completed', 'Cancelled', 'Confirmed'];

    const refreshData = async () => {
        router.refresh();
    };

    const { handleAccept, handleReject, handleComplete } = useAppointmentActions(refreshData);

    const filteredAppointments = (appointments || []).filter((appointment) => {
        const matchesSearch =
            !searchQuery ||
            appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All Status" ||
            !statusFilter ||
            appointment.status === statusFilter;
        const matchesDate =
            !selectedDate || appointment.startAt.startsWith(selectedDate);

        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatisticsCard
                        title="Pending"
                        value={stats.totalPenddingAppointmentCount}
                        icon={<Clock className="w-6 h-6 text-orange-600" />}
                        bgColor="bg-orange-50"
                    />
                    <StatisticsCard
                        title="Confirmed"
                        value={stats.totalConfirmedAppointmentCount}
                        icon={<CheckCircle2 className="w-6 h-6 text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    <StatisticsCard
                        title="Cancelled"
                        value={stats.totalCancelledAppointmentCount}
                        icon={<XCircle className="w-6 h-6 text-red-600" />}
                        bgColor="bg-red-50"
                    />
                    <StatisticsCard
                        title="Completed"
                        value={stats.totalCompletedAppointmentCount}
                        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                        bgColor="bg-green-50"
                    />
                </div>
            )}

            {/* Dashboard Tabs */}
            <Tabs defaultValue="appointments" className="space-y-6">
                <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm inline-flex h-auto">
                    <TabsTrigger 
                        value="appointments" 
                        className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#2BBBC5] data-[state=active]:text-white font-bold transition-all text-gray-500"
                    >
                        Medical Appointments
                    </TabsTrigger>
                    <TabsTrigger 
                        value="availability" 
                        className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#2BBBC5] data-[state=active]:text-white font-bold transition-all text-gray-500"
                    >
                        Working Hours
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-6 outline-none">
                    {/* Search and Filters */}
                    <div className="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2BBBC5]/10 rounded-full -mr-16 -mt-16 opacity-50" />
                        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by patient name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 h-12 bg-gray-50 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2BBBC5]/20 focus:border-[#2BBBC5] transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="relative w-full md:w-48">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2BBBC5]/20 focus:border-[#2BBBC5] transition-all text-sm font-medium"
                                />
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>

                            <div className="relative w-full md:w-auto">
                                <button
                                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                    className="flex items-center justify-between gap-2 px-6 h-12 bg-gray-50 border-gray-100 rounded-2xl hover:bg-gray-100 transition-all min-w-[160px] text-sm font-bold text-gray-700"
                                >
                                    <span>{statusFilter}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showStatusDropdown && (
                                    <div className="absolute top-full mt-2 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 w-full min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {statusOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setStatusFilter(option !== "All Status" ? option.toLowerCase() : "All Status");
                                                    setShowStatusDropdown(false);
                                                }}
                                                className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-[#2BBBC5]/10 hover:text-[#2BBBC5] transition-all flex items-center justify-between group"
                                            >
                                                {option}
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2BBBC5] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black font-outfit text-gray-900 tracking-tight">
                                {statusFilter === 'All Status' ? 'All Appointments' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Appointments`}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">Manage your patient visits and requests</p>
                        </div>
                        <div className="px-5 py-2 bg-white text-[#2BBBC5] rounded-2xl text-xs font-black shadow-sm border border-[#2BBBC5]/20 flex items-center gap-3 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-[#2BBBC5] animate-pulse"></span>
                            {filteredAppointments.length} Appointments Found
                        </div>
                    </div>

                    {/* Appointments Grid */}
                    {filteredAppointments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAppointments.map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    appointment={appointment}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    onComplete={handleComplete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 mb-6 text-gray-300">
                                <Calendar className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No appointments found</h3>
                            <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or check another date</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="availability" className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black font-outfit text-gray-900 tracking-tight">Working Hours</h2>
                            <p className="text-gray-500 font-medium mt-1">Set the timings when patients can book appointments</p>
                        </div>
                        
                        {!isFormOpen && (
                            <Button 
                                onClick={() => setIsFormOpen(true)}
                                className="bg-[#2BBBC5] hover:bg-[#25A0A9] text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-[#2BBBC5]/20 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Time Slot
                            </Button>
                        )}
                    </div>

                    {isFormOpen && (
                        <div className="animate-in zoom-in-95 duration-200">
                            <AvailabilityForm 
                                onSubmit={handleFormSubmit}
                                onCancel={() => {
                                    setIsFormOpen(false);
                                    setEditingSlot(null);
                                }}
                                initialData={editingSlot}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    )}

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-[#2BBBC5]/10 flex items-center justify-center text-[#2BBBC5]">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Weekly Schedule</h3>
                                <p className="text-sm text-gray-500 font-medium">Your current availability slots</p>
                            </div>
                        </div>

                        {isLoadingAvailabilities ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-10 h-10 text-[#2BBBC5] animate-spin" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Schedule...</p>
                            </div>
                        ) : (
                            <AvailabilityList 
                                availabilities={availabilities}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                isDeleting={isDeletingId}
                            />
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSlotToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Time Slot"
                description="Are you sure you want to remove this availability slot? Patients will no longer be able to book during this time."
                confirmText="Delete"
                cancelText="Keep It"
                variant="destructive"
                isLoading={isDeletingId !== null}
            />
        </div>
    );
}
