"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PharmaciesFilters } from "@/components/features/admin/pharmacies/PharmaciesFilters";
import { PharmaciesTable } from "@/components/features/admin/pharmacies/PharmaciesTable";
import { AdminPharmacist } from "@/types/admin";
import { approvePharmacist, rejectPharmacist, deletePharmacist } from "@/Services/admin/pharmacies";
import { adminService } from "@/Services/admin/adminService";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface PharmaciesManagementClientProps {
  initialPharmacists: AdminPharmacist[];
}

export default function PharmaciesManagementClient({ initialPharmacists }: PharmaciesManagementClientProps) {
    const [pharmacists, setPharmacists] = useState<AdminPharmacist[]>(initialPharmacists);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    const handleApprove = async (id: number) => {
        try {
            const res = await approvePharmacist(id);
            toast.success(res.message || "Pharmacist approved successfully");
            setPharmacists(prev => prev.map(p => p.id === id ? { ...p, isApproved: true, isReject: false } : p));
            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to approve pharmacist";
            toast.error(message);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const res = await rejectPharmacist(id);
            toast.success(res.message || "Pharmacist rejected successfully");
            setPharmacists(prev => prev.map(p => p.id === id ? { ...p, isApproved: false, isReject: true } : p));
            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to reject pharmacist";
            toast.error(message);
        }
    };

    const handleDelete = (id: number) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;

        try {
            setIsDeleting(true);
            const res = await deletePharmacist(idToDelete);
            toast.success(res.message || "Pharmacist deleted successfully");
            setPharmacists(prev => prev.filter(p => p.id !== idToDelete));
            setDeleteDialogOpen(false);
            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete pharmacist";
            toast.error(message);
        } finally {
            setIsDeleting(false);
            setIdToDelete(null);
        }
    };


    const handleViewDetails = (pharmacist: AdminPharmacist) => {
        router.push(`/admin/pharmacies/${pharmacist.userId}`);
    };

    const handleInventoryClick = (pharmacist: AdminPharmacist) => {
        router.push(`/admin/pharmacies/${pharmacist.userId}/inventory`);
    };

    const handleOrdersClick = (pharmacist: AdminPharmacist) => {
        router.push(`/admin/pharmacies/${pharmacist.userId}/orders`);
    };

    const handleStartChat = async (pharmacistId: number) => {
        try {
            const thread = await adminService.startChatWithPharmacist(pharmacistId);
            router.push(`/admin/messages?threadId=${thread.id}`);
        } catch (error) {
            console.error("Failed to start chat:", error);
            toast.error("Failed to start chat with pharmacist");
        }
    };

    const filteredPharmacists = pharmacists.filter(pharmacist => {
        const matchesSearch =
            pharmacist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacist.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacist.city.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "approved") return matchesSearch && pharmacist.isApproved;
        if (filter === "rejected") return matchesSearch && pharmacist.isReject;
        if (filter === "pending") return matchesSearch && !pharmacist.isApproved && !pharmacist.isReject;
        return matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
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
                loading={false}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onInventoryClick={handleInventoryClick}
                onOrdersClick={handleOrdersClick}
                onStartChat={handleStartChat}
            />

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Pharmacy"
                description="Are you sure you want to delete this pharmacist and their pharmacy? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
}
