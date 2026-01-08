"use client";

import { useEffect, useState, use, useCallback } from "react";
import { 
    getPharmacistById, 
    getPharmacyOfPharmacist, 
} from "@/Services/admin/pharmacies";
import { AdminPharmacist, AdminPharmacyDetails } from "@/types/admin";
import { DetailPageHeader } from "@/Components/features/admin/pharmacies/details/DetailPageHeader";
import { PharmacistProfileCard } from "@/Components/features/admin/pharmacies/details/PharmacistProfileCard";
import { PharmacyInfoCard } from "@/Components/features/admin/pharmacies/details/PharmacyInfoCard";
import { Activity } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function PharmacyDetailPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const router = useRouter();
    const [pharmacist, setPharmacist] = useState<AdminPharmacist | null>(null);
    const [pharmacy, setPharmacy] = useState<AdminPharmacyDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const pharmacistData = await getPharmacistById(userId);
            setPharmacist(pharmacistData);

            if (pharmacistData) {
                const pharmacyData = await getPharmacyOfPharmacist(userId);
                setPharmacy(pharmacyData);
            }
        } catch (error) {
            console.error("Failed to fetch pharmacy details:", error);
            toast.error("Failed to load pharmacy details");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading pharmacy details...</p>
                </div>
            </div>
        );
    }

    if (!pharmacist) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500">Pharmacist not found.</p>
                <Button variant="link" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <DetailPageHeader 
                pharmacyName={pharmacist.pharmacyName}
                isApproved={pharmacist.isApproved}
                isReject={pharmacist.isReject}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-3">
                    <PharmacistProfileCard pharmacist={pharmacist} onRefresh={fetchData} />
                </div>
                {pharmacy && (
                    <div className="lg:col-span-9 h-full">
                        <PharmacyInfoCard pharmacy={pharmacy} userId={userId} onRefresh={fetchData} />
                    </div>
                )}
            </div>
        </div>
    );
}
