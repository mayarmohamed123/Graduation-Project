"use client";

import { useEffect, useState } from "react";
import { bloodDonorService } from "@/Services/bloodDonorService";
import { RequestDonor } from "@/types/blood";
import { toast } from "react-hot-toast";
import { MapPin, Phone, Calendar, ArrowLeft, Droplet } from "lucide-react";
import { formatBloodType } from "@/lib/bloodUtils";

interface RequestDonorsListProps {
    requestId: number;
    hospitalName: string;
    onBack: () => void;
}

export default function RequestDonorsList({ requestId, hospitalName, onBack }: RequestDonorsListProps) {
    const [donors, setDonors] = useState<RequestDonor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const data = await bloodDonorService.getDonorsByRequest(requestId);
                setDonors(data);
            } catch {
                toast.error("Failed to load donors");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonors();
    }, [requestId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Back to requests"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Donors for {hospitalName}</h2>
                    <p className="text-gray-500 text-sm">List of people who responded to this request</p>
                </div>
            </div>

            {donors.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No donors have responded to this request yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {donors.map((donor) => (
                        <div key={donor.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {formatBloodType(donor.bloodType)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Donor #{donor.id}</h3>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <MapPin size={14} className="text-primary" />
                                            <span>{donor.city}, {donor.country}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone size={16} className="text-primary" />
                                        <span className="font-medium">{donor.donorTelephone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} className="text-primary" />
                                        <span className="text-sm">Last Donation: {new Date(donor.lastDonationDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {donor.isAvailable && (
                                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold self-start md:self-center">
                                    AVAILABLE
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
