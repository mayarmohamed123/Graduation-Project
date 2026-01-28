"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorsFilters } from "@/components/features/admin/doctors/DoctorsFilters";
import { DoctorsTable } from "@/components/features/admin/doctors/DoctorsTable";
import { DoctorDetailsDialog } from "@/components/features/admin/doctors/DoctorDetailsDialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { adminService } from "@/Services/admin/adminService";
import { AdminDoctor, DoctorProfileData, ClinicInfoData } from "@/types/admin";
import { toast } from "react-hot-toast";

interface DoctorsManagementClientProps {
  initialDoctors: AdminDoctor[];
}

export default function DoctorsManagementClient({ initialDoctors }: DoctorsManagementClientProps) {
    const router = useRouter();
    const [doctors, setDoctors] = useState<AdminDoctor[]>(initialDoctors);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
    const [selectedDoctor, setSelectedDoctor] = useState<AdminDoctor | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleApprove = async (id: number) => {
        try {
            await adminService.approveDoctor(id);
            setDoctors(prev => prev.map(d => d.id === id ? { ...d, isApproved: true, isRejected: false } : d));
            toast.success("Doctor approved successfully");
            router.refresh();
        } catch (error) {
            console.error("Failed to approve doctor:", error);
            toast.error("Failed to approve doctor");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await adminService.rejectDoctor(id);
            setDoctors(prev => prev.map(d => d.id === id ? { ...d, isApproved: false, isRejected: true } : d));
            toast.success("Doctor rejected/suspended successfully");
            router.refresh();
        } catch (error) {
            console.error("Failed to reject doctor:", error);
            toast.error("Failed to reject doctor");
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId === null) return;

        try {
            setDeleteLoading(true);
            await adminService.deleteDoctor(deleteId);
            setDoctors(prev => prev.filter(d => d.id !== deleteId));
            toast.success("Doctor deleted successfully");
            setIsDeleteOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete doctor:", error);
            toast.error("Failed to delete doctor");
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    };

    const handleUpdate = async (id: number, profileData: DoctorProfileData, clinicData: ClinicInfoData) => {
        const doctor = doctors.find(d => d.id === id);
        if (!doctor?.userId) {
            toast.error("User ID not found for this doctor");
            return;
        }

        try {
            const promises = [];
            const hasProfileUpdate = profileData.username || profileData.specialty ||
                profileData.consultationPrice || profileData.consultationType ||
                profileData.image;

            if (hasProfileUpdate) {
                const profileFormData = new FormData();
                if (profileData.username) profileFormData.append("username", profileData.username);
                if (profileData.email) profileFormData.append("email", profileData.email);
                if (profileData.specialty) profileFormData.append("specialty", profileData.specialty);
                if (profileData.consultationPrice) profileFormData.append("consultationPrice", profileData.consultationPrice.toString());
                if (profileData.consultationType && profileData.consultationType.trim() !== "") {
                    profileFormData.append("consultationType", profileData.consultationType);
                }
                if (profileData.image) profileFormData.append("image", profileData.image);
                promises.push(adminService.updateDoctorProfile(doctor.userId, profileFormData));
            }

            if (clinicData.name || clinicData.Phone || clinicData.city || clinicData.street || clinicData.country || clinicData.image) {
                const clinicFormData = new FormData();
                if (clinicData.name) clinicFormData.append("name", clinicData.name);
                if (clinicData.Phone) clinicFormData.append("phone", clinicData.Phone);
                if (clinicData.city) clinicFormData.append("city", clinicData.city);
                if (clinicData.street) clinicFormData.append("street", clinicData.street);
                if (clinicData.country) clinicFormData.append("country", clinicData.country);
                if (clinicData.image) clinicFormData.append("image", clinicData.image);
                promises.push(adminService.updateClinic(doctor.userId, clinicFormData));
            }

            if (promises.length === 0) return;
            await Promise.all(promises);

            const allDoctors = await adminService.getAllDoctors();
            setDoctors(allDoctors);
            const updated = allDoctors.find(d => d.id === id);
            if (updated && selectedDoctor?.id === id) {
                setSelectedDoctor(updated);
            }
            
            toast.success("Doctor details updated successfully");
            router.refresh();
        } catch (error) {
            console.error("Failed to update doctor:", error);
            toast.error("Failed to update doctor details");
        }
    };

    const handleViewDetails = (doctor: AdminDoctor) => {
        setSelectedDoctor(doctor);
        setIsDetailsOpen(true);
    };

    const handleStartChat = async (doctorId: number) => {
        try {
            const thread = await adminService.startChatWithDoctor(doctorId);
            router.push(`/admin/messages?threadId=${thread.id}`);
        } catch (error) {
            console.error("Failed to start chat:", error);
            toast.error("Failed to start chat with doctor");
        }
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
                loading={false}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDeleteClick}
                onViewDetails={handleViewDetails}
                onStartChat={handleStartChat}
            />

            <DoctorDetailsDialog
                doctor={selectedDoctor}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onUpdate={handleUpdate}
            />

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Doctor"
                description="Are you sure you want to delete this doctor? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                loading={deleteLoading}
            />
        </div>
    );
}
