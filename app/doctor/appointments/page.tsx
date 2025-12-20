"use client";
import StatisticsCard from "@/Components/features/doctor/StatisticsCard";
import AppointmentCard from "@/Components/features/doctor/AppointmentCard";
import React, { useState, useEffect } from "react";
import {
    Search,
    Bell,
    Calendar,
    Users,
    DollarSign,
    ChevronDown,
} from "lucide-react";
import { appointmentService } from "@/Services/appointmentServices";
import { AppointmentInfo, AppointmentStats } from "@/types/appointments";
import toast from "react-hot-toast";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { useAppointmentActions } from "@/hooks/useAppointmentActions";

export default function AppointmentsPage() {
    // States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All Status");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Data States
    const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
    const [stats, setStats] = useState<AppointmentStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const statusOptions = ['All Status', 'Pending', 'Completed', 'Cancelled', 'Confirmed'];

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch appointments and statistics
    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch both statistics and appointments in parallel
            const [statsData, appointmentsData] = await Promise.all([
                appointmentService.getAppointmentStats(),
                appointmentService.getDoctorAppointments(),
            ]);

            setStats(statsData);
            setAppointments(appointmentsData);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to load appointments";
            toast.error(errorMessage);
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter appointments based on search and filters
    const filteredAppointments = appointments.filter((appointment) => {
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

    // Use the custom hook for actions
    const { handleAccept, handleReject, handleComplete } = useAppointmentActions(fetchData);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Statistics Cards */}
            {isLoading ? (
                <LoadingSpinner />
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatisticsCard
                        title="Total Appointments"
                        value={stats.totalAppointmentCount}
                        icon={<Calendar className="w-6 h-6 text-teal-600" />}
                        iconBgColor="bg-teal-50"
                    />
                    <StatisticsCard
                        title="Total Revenue"
                        value={stats.totalRevenue}
                        icon={<DollarSign className="w-6 h-6 text-orange-600" />}
                        iconBgColor="bg-orange-50"
                    />
                    <StatisticsCard
                        title="Total Patients"
                        value={stats.totalPatientsCount}
                        icon={<Users className="w-6 h-6 text-green-600" />}
                        iconBgColor="bg-green-50"
                    />
                </div>
            ) : null}

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-4">

                    {/* Search by Patient */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary "
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary  w-48"
                        />
                    </div>


                    {/* Status Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors min-w-[140px]"
                        >
                            <span className="text-gray-700">{statusFilter}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500 ml-auto" />
                        </button>

                        {showStatusDropdown && (
                            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-full z-10">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setStatusFilter(option !== "All Status" ? option.toLowerCase() : "All Status");
                                            setShowStatusDropdown(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* Results Count */}
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {statusFilter === 'All Status' ? 'All Appointments' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Appointments`}
                        </h2>
                        <span className="px-4 py-1.5 bg-white text-teal-600 rounded-full text-sm font-semibold shadow-sm border border-teal-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                            {filteredAppointments.length} Result{filteredAppointments.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Appointments Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                    {/* No Results */}
                    {filteredAppointments.length === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium">No appointments found</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
