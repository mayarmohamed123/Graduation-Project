"use client";

import { useEffect, useState } from "react";
import { bloodDonorService } from "@/Services/bloodDonorService";
import { BloodDonation } from "@/types/blood";
import { toast } from "react-hot-toast";
import { MapPin, Calendar, Trash2, Droplet, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { formatBloodType } from "@/lib/bloodUtils";

export default function MyDonations() {
    const [donations, setDonations] = useState<BloodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [donationToDelete, setDonationToDelete] = useState<BloodDonation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const fetchDonations = async () => {
        try {
            const data = await bloodDonorService.getMyDonations();
            setDonations(data);
        } catch {
            toast.error("Failed to load your donations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const openDeleteModal = (donation: BloodDonation) => {
        setDonationToDelete(donation);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!donationToDelete) return;

        setIsDeleting(true);
        try {
            await bloodDonorService.deleteDonation(donationToDelete.id);
            toast.success("Donation deleted successfully");
            setDonations(prev => prev.filter(d => d.id !== donationToDelete.id));
            setIsDeleteOpen(false);
            setDonationToDelete(null);
        } catch {
            toast.error("Failed to delete donation");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Donations</h2>

            {donations.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">You haven&apos;t made any donations yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {donations.map((donation) => (
                        <div key={donation.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-primary">
                                        Donation to {donation.bloodRequest.hospitalName}
                                    </h3>
                                    {donation.isAvailable && (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                            Available
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-lg font-semibold text-gray-800">
                                        Blood Type: <span className="text-primary">{formatBloodType(donation.bloodType)}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Request in: {donation.bloodRequest.city}, {donation.bloodRequest.country}
                                    </p>
                                </div>

                                <div className="space-y-2 grid grid-cols-1 md:grid-cols-2">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin size={16} className="text-primary" />
                                        <span>From: {donation.city}, {donation.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar size={16} className="text-primary" />
                                        <span>Last Donation: {new Date(donation.lastDonationDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} className="text-primary" />
                                        <span>{donation.donorTelephone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteModal(donation)}
                                    disabled={isDeleting}
                                    className="flex-1 md:flex-none gap-2 rounded-xl"
                                >
                                    <Trash2 size={16} /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Donation Record"
                description={`Are you sure you want to delete your donation record for ${donationToDelete?.bloodRequest.hospitalName}? This action cannot be undone.`}
                confirmText="Delete Record"
                variant="destructive"
                loading={isDeleting}
            />
        </div>
    );
}
