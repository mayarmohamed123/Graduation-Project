"use client";

import { useEffect, useState } from "react";
import { DoctorsFilters } from "@/Components/features/admin/doctors/DoctorsFilters";
import { DoctorsTable } from "@/Components/features/admin/doctors/DoctorsTable";
import { DoctorDetailsDialog } from "@/Components/features/admin/doctors/DoctorDetailsDialog";
import { AdminDoctor } from "@/types/admin";
import { adminService } from "@/Services/admin/adminService";

export default function DoctorsManagement() {
    const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
    const [selectedDoctor, setSelectedDoctor] = useState<AdminDoctor | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllDoctors();
            setDoctors(data);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        await adminService.approveDoctor(id);
        // Optimistic update or refetch
        setDoctors(doctors.map(d => d.id === id ? { ...d, isApproved: true } : d));
    };

    const handleReject = async (id: number) => {
        await adminService.rejectDoctor(id);
        // Optimistic update or refetch
        setDoctors(doctors.map(d => d.id === id ? { ...d, isApproved: false } : d));
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this doctor?")) {
            await adminService.deleteDoctor(id);
            setDoctors(doctors.filter(d => d.id !== id));
        }
    };

    const handleUpdate = async (id: number, data: Partial<AdminDoctor>) => {
        await adminService.updateDoctor(id, data);
        setDoctors(doctors.map(d => d.id === id ? { ...d, ...data } : d));
        // Update selected doctor if currently selected (for optimistic UI in modal)
        if (selectedDoctor && selectedDoctor.id === id) {
            setSelectedDoctor({ ...selectedDoctor, ...data });
        }
    };

    const handleViewDetails = (doctor: AdminDoctor) => {
        setSelectedDoctor(doctor);
        setIsDetailsOpen(true);
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch =
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.clinicName?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "approved") return matchesSearch && doctor.isApproved;
        if (filter === "pending") return matchesSearch && !doctor.isApproved;
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Doctors Management</h1>
                    <p className="text-gray-500">Manage and verify doctor accounts</p>
                </div>

                <DoctorsFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filter={filter}
                    onFilterChange={setFilter}
                />
            </div>

            <DoctorsTable
                doctors={filteredDoctors}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
            />

            <DoctorDetailsDialog
                doctor={selectedDoctor}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
