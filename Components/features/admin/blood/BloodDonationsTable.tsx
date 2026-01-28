"use client";

import { AdminBloodDonation } from "@/types/blood";
import { MapPin, Calendar, Droplet, Phone, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { formatBloodType } from "@/lib/bloodUtils";
import { format } from "date-fns";

interface BloodDonationsTableProps {
    donations: AdminBloodDonation[];
    loading: boolean;
    onDelete: (id: number) => void;
}

export function BloodDonationsTable({
    donations,
    loading,
    onDelete,
}: BloodDonationsTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No blood donations found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Donor Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {donations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Droplet className="w-4 h-4 text-primary" />
                                            <span className="font-semibold text-primary">
                                                {formatBloodType(donation.bloodType)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                Last Donation:{" "}
                                                {donation.lastDonationDate === "0001-01-01T00:00:00"
                                                    ? "Never"
                                                    : format(new Date(donation.lastDonationDate), "MMM dd, yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{donation.donorTelephone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {donation.city}, {donation.country}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Lat: {donation.latitude.toFixed(4)}, Lng: {donation.longitude.toFixed(4)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {donation.isAvailable ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <CheckCircle className="w-3 h-3" />
                                            Available
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            Unavailable
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(donation.id)}
                                        className="gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
