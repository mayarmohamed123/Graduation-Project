"use client";

import { useEffect, useState } from "react";
import { DoctorsFilters } from "@/Components/features/admin/doctors/DoctorsFilters";
import { DoctorsTable } from "@/Components/features/admin/doctors/DoctorsTable";
import { DoctorDetailsDialog } from "@/Components/features/admin/doctors/DoctorDetailsDialog";
import { ConfirmationDialog } from "@/Components/ui/confirmation-dialog";
import { adminService } from "@/Services/admin/adminService";
import { AdminDoctor, DoctorProfileData, ClinicInfoData } from "@/types/admin";
import { toast } from "react-hot-toast";

export default function DoctorsManagement() {
    const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
    const [selectedDoctor, setSelectedDoctor] = useState<AdminDoctor | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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
            toast.error("Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await adminService.approveDoctor(id);
            setDoctors(doctors.map(d => d.id === id ? { ...d, isApproved: true, isRejected: false } : d));
            toast.success("Doctor approved successfully");
        } catch (error) {
            console.error("Failed to approve doctor:", error);
            toast.error("Failed to approve doctor");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await adminService.rejectDoctor(id);
            setDoctors(doctors.map(d => d.id === id ? { ...d, isApproved: false, isRejected: true } : d));
            toast.success("Doctor rejected/suspended successfully");
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
            setDoctors(doctors.filter(d => d.id !== deleteId));
            toast.success("Doctor deleted successfully");
            setIsDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete doctor:", error);
            toast.error("Failed to delete doctor");
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    };

    const handleUpdate = async (id: number, profileData: DoctorProfileData, clinicData: ClinicInfoData) => {
        // Find the doctor to get the userId
        const doctor = doctors.find(d => d.id === id);
        if (!doctor?.userId) {
            toast.error("User ID not found for this doctor");
            return;
        }

        try {
            const promises = [];

            // Update doctor profile if any profile fields are present
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
                    console.log("Appending consultationType:", profileData.consultationType);
                    profileFormData.append("consultationType", profileData.consultationType);
                }
                if (profileData.image) profileFormData.append("image", profileData.image);

                // Debug: Log all FormData entries
                console.log("Profile FormData entries:");
                for (const [key, value] of profileFormData.entries()) {
                    console.log(`  ${key}:`, value);
                }

                promises.push(adminService.updateDoctorProfile(doctor.userId, profileFormData));
            }

            // Update clinic if any clinic fields are present
            const hasClinicUpdate = clinicData.name || clinicData.Phone ||
                clinicData.city || clinicData.street || clinicData.country ||
                clinicData.image;

            if (hasClinicUpdate) {
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

            // Always refetch the doctor data to ensure UI reflects the saved data
            try {
                // Refetch all doctors to get the updated data from server
                const allDoctors = await adminService.getAllDoctors();
                const updatedDoctor = allDoctors.find(d => d.id === id);

                if (updatedDoctor) {
                    // Update the entire doctors list with fresh data
                    setDoctors(allDoctors);

                    // Update selected doctor if currently selected
                    if (selectedDoctor && selectedDoctor.id === id) {
                        setSelectedDoctor(updatedDoctor);
                    }
                }
            } catch (refetchError) {
                console.error("Failed to refetch doctor data:", refetchError);
                // Fall back to manual update if refetch fails
                const updateFields = { ...profileData, ...clinicData };
                setDoctors(doctors.map(d => d.id === id ? { ...d, ...updateFields } : d));
                if (selectedDoctor && selectedDoctor.id === id) {
                    setSelectedDoctor({ ...selectedDoctor, ...updateFields });
                }
            }

            toast.success("Doctor details updated successfully");
        } catch (error) {
            console.error("Failed to update doctor:", error);
            toast.error("Failed to update doctor details");
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
                onDelete={handleDeleteClick}
                onViewDetails={handleViewDetails}
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

