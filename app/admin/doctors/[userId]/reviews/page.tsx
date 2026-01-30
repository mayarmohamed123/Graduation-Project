"use client";

import { useEffect, useState, use, useCallback } from "react";
import { doctorService } from "@/Services/doctorService";
import { adminService } from "@/Services/admin/adminService";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { AdminDoctor } from "@/types/admin";
import ReviewList from "@/components/features/admin/reviews/ReviewList";
import { Activity, ArrowLeft, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function DoctorReviewsPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const router = useRouter();
    const [doctor, setDoctor] = useState<AdminDoctor | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const doctors = await adminService.getAllDoctors();
            const doctorData = doctors.find(d => d.userId === userId);
            
            if (!doctorData) {
                toast.error("Doctor not found");
                router.back();
                return;
            }
            
            setDoctor(doctorData);
        } catch (error) {
            console.error("Failed to fetch doctor details:", error);
            toast.error("Failed to load doctor details");
        } finally {
            setLoading(false);
        }
    }, [userId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading reviews...</p>
                </div>
            </div>
        );
    }

    if (!doctor) return null;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold font-outfit text-gray-900">
                            Dr. {doctor.username} Reviews
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage patient feedback for this doctor</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Rating</p>
                        <p className="text-lg font-black text-gray-900 leading-none mt-1">{doctor.averageRating?.toFixed(1) || "0.0"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500">
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
                    <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                        {doctor.doctorImage ? (
                            <Image src={doctor.doctorImage} fill alt={doctor.username} className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User className="w-10 h-10" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{doctor.username}</h2>
                        <p className="text-teal-600 font-bold uppercase tracking-widest text-xs mt-1">{doctor.specialty}</p>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                {doctor.clinicName}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {doctor.countPatient} Patients
                            </div>
                        </div>
                    </div>
                </div>

                <ReviewList 
                    type="doctor"
                    entityId={doctor.id}
                    fetchReviews={doctorService.getDoctorReviews}
                    deleteReview={pharmacyService.deleteReview}
                />
            </div>
        </div>
    );
}
