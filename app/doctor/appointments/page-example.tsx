'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Calendar, Users, DollarSign, ChevronDown } from 'lucide-react';
import StatusCard from '@/Components/features/doctor/StatisticsCard';
import { AppointmentInfo, AppointmentStats } from '@/types/appointments';
import { appointmentService } from '@/Services/appointmentServices';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Data States
    const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
    const [stats, setStats] = useState<AppointmentStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        } catch (error: any) {
            toast.error(error.message || 'Failed to load appointments');
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter appointments based on search and filters
    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch = appointment.patientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'All Status' || appointment.status === statusFilter;
        const matchesDate = !selectedDate || appointment.startAt.startsWith(selectedDate);

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Handle Accept Appointment
    const handleAccept = async (appointmentId: string) => {
        try {
            await appointmentService.acceptAppointment(appointmentId);
            toast.success('Appointment accepted successfully!');
            fetchData(); // Refresh data
        } catch (error: any) {
            toast.error(error.message || 'Failed to accept appointment');
        }
    };

    // Handle Reject Appointment
    const handleReject = async (appointmentId: string) => {
        try {
            await appointmentService.rejectAppointment(appointmentId);
            toast.success('Appointment rejected');
            fetchData(); // Refresh data
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject appointment');
        }
    };

    // Handle Reschedule Appointment
    const handleReschedule = async (appointmentId: string) => {
        // You can open a modal here to get new time
        toast.info('Reschedule feature coming soon!');
    };

    const statusOptions = ['All Status', 'Pending', 'Upcoming', 'Completed', 'Cancelled'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                            <Bell className="w-6 h-6 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                                <span className="text-white font-semibold">NA</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">Nourhan Adel</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Statistics Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 h-24 animate-pulse"></div>
                        ))}
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatusCard
                            title="Total Appointments"
                            value={stats.totalAppointmentsCount}
                            icon={<Calendar className="w-6 h-6 text-teal-600" />}
                            iconBgColor="bg-teal-50"
                        />
                        <StatusCard
                            title="Total Revenue"
                            value={`$${stats.totalRevenue}`}
                            icon={<DollarSign className="w-6 h-6 text-orange-600" />}
                            iconBgColor="bg-orange-50"
                        />
                        <StatusCard
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
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48"
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
                                                setStatusFilter(option);
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
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 h-40 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Appointments Grid - You'll need to create AppointmentCard component */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredAppointments.map((appointment, index) => (
                                <div key={index} className="bg-white rounded-2xl border-2 border-teal-100 p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                                appointment.status === 'Completed' ? 'bg-teal-100 text-teal-600' :
                                                    appointment.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            {appointment.patientAge} years, {appointment.patientGender}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Phone: {appointment.patientPhone}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(appointment.startAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span>{new Date(appointment.startAt).toLocaleTimeString()} - {new Date(appointment.endAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons for Pending */}
                                        {appointment.status === 'Pending' && (
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handleAccept(appointment.patientPhone)} // Use proper ID when available
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(appointment.patientPhone)} // Use proper ID when available
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleReschedule(appointment.patientPhone)} // Use proper ID when available
                                                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors"
                                                >
                                                    Reschedule
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredAppointments.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No appointments found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
