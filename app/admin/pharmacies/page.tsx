"use client";

import { useEffect, useState } from "react";
import { PharmaciesFilters } from "@/Components/features/admin/pharmacies/PharmaciesFilters";
import { PharmaciesTable } from "@/Components/features/admin/pharmacies/PharmaciesTable";
import { PharmacyDetailsDialog } from "@/Components/features/admin/pharmacies/PharmacyDetailsDialog";
import { AdminPharmacist } from "@/types/admin";
import { getAdminPharmacists, approvePharmacist, rejectPharmacist, deletePharmacist, updatePharmacistProfile } from "@/Services/admin/pharmacies";
import { toast } from "react-hot-toast";

export default function PharmaciesManagement() {
    const [pharmacists, setPharmacists] = useState<AdminPharmacist[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
    const [selectedPharmacist, setSelectedPharmacist] = useState<AdminPharmacist | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchPharmacists();
    }, []);

    const fetchPharmacists = async () => {
        try {
            setLoading(true);
            const data = await getAdminPharmacists();
            setPharmacists(data);
        } catch (error) {
            console.error("Failed to fetch pharmacists:", error);
            toast.error("Failed to load pharmacists listings");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const res = await approvePharmacist(id);
            toast.success(res.message || "Pharmacist approved successfully");
            setPharmacists(prev => prev.map(p => p.id === id ? { ...p, isApproved: true } : p));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to approve pharmacist";
            toast.error(message);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const res = await rejectPharmacist(id);
            toast.success(res.message || "Pharmacist rejected successfully");
            setPharmacists(prev => prev.map(p => p.id === id ? { ...p, isApproved: false } : p));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to reject pharmacist";
            toast.error(message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this pharmacist and their pharmacy? This action cannot be undone.")) return;
        
        try {
            const res = await deletePharmacist(id);
            toast.success(res.message || "Pharmacist deleted successfully");
            setPharmacists(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete pharmacist";
            toast.error(message);
        }
    };

    const handleUpdate = async (userId: string, data: Partial<AdminPharmacist>) => {
        try {
            const res = await updatePharmacistProfile(userId, data);
            toast.success(res.message || "Profile updated successfully");
            setPharmacists(prev => prev.map(p => p.userId === userId ? { ...p, ...data } : p));
            if (selectedPharmacist && selectedPharmacist.userId === userId) {
                setSelectedPharmacist({ ...selectedPharmacist, ...data });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update profile";
            toast.error(message);
            throw error;
        }
    };

    const handleViewDetails = (pharmacist: AdminPharmacist) => {
        setSelectedPharmacist(pharmacist);
        setIsDetailsOpen(true);
    };

    const filteredPharmacists = pharmacists.filter(pharmacist => {
        const matchesSearch =
            pharmacist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacist.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacist.city.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "approved") return matchesSearch && pharmacist.isApproved;
        if (filter === "pending") return matchesSearch && !pharmacist.isApproved;
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pharmacies Management</h1>
                    <p className="text-gray-500">Review and manage pharmacy accounts and verification</p>
                </div>

                <PharmaciesFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filter={filter}
                    onFilterChange={setFilter}
                />
            </div>

            <PharmaciesTable
                pharmacists={filteredPharmacists}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
            />

            <PharmacyDetailsDialog
                pharmacist={selectedPharmacist}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
