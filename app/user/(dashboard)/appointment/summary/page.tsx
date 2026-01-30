"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "react-hot-toast";
import { doctorService } from "@/Services/doctorService";
import { Doctor } from "@/types/doctors";

function AppointmentSummaryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get query params
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    // State
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        patientName: "",
        patientPhone: "",
        patientAge: "",
        patientGender: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch Doctor Data
    useEffect(() => {
        const fetchDoctor = async () => {
            if (!doctorId) return;
            try {
                const data = await doctorService.getDoctorById(Number(doctorId));
                setDoctor(data);
            } catch (error) {
                console.error("Failed to fetch doctor:", error);
                toast.error("Failed to load doctor details");
            } finally {
                setIsLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctor();
        } else {
            setIsLoading(false);
        }
    }, [doctorId]);

    // Derived values
    const consultationFee = doctor?.consultationPrice || 0;
    const serviceCharge = 5; // Example fixed service charge
    const totalAmount = consultationFee + serviceCharge;

    // Form Handling
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.patientName.trim()) newErrors.patientName = "Name is required";
        if (!formData.patientPhone.trim()) {
            newErrors.patientPhone = "Phone is required";
        } else if (!/^\d{10,15}$/.test(formData.patientPhone.replace(/\s/g, ""))) {
            newErrors.patientPhone = "Invalid phone number";
        }
        if (!formData.patientAge) {
            newErrors.patientAge = "Age is required";
        } else if (Number(formData.patientAge) < 1 || Number(formData.patientAge) > 120) {
            newErrors.patientAge = "Invalid age";
        }
        if (!formData.patientGender) newErrors.patientGender = "Gender is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = async () => {
        if (!validateForm() || !doctor || !startTime || !endTime) return;

        setIsSubmitting(true);
        try {
            const payload = {
                doctorId: doctor.id,
                clinicId: doctor.clinicId,
                startAt: startTime,
                endAt: endTime,
                PatientName: formData.patientName,
                PatientPhone: formData.patientPhone,
                patientAge: Number(formData.patientAge),
                patientGender: formData.patientGender,
            };

            // 1. Book Appointment
            const bookingResponse = await doctorService.bookAppointmentInClinic(payload);

            // 2. Create Payment Session
            const sessionResponse = await doctorService.createPaymentSession(
                bookingResponse.appointment.id
            );

            // 3. Redirect to Stripe
            window.location.href = sessionResponse.sessionUrl;

        } catch (error) {
            console.error("Booking failed:", error);
            toast.error(error instanceof Error ? error.message : "Failed to process booking");
            setIsSubmitting(false);
        }
    };

    // Helper: Format Date/Time
    const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : "";

    const formattedTime = startTime ? new Date(startTime).toLocaleTimeString("en-US", {
        hour: '2-digit', minute: '2-digit', hour12: true
    }) : "";

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#2BBBC5]" /></div>;
    }

    if (!doctor || !date || !startTime) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Invalid Appointment Details</h1>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-black font-outfit text-gray-900">Appointment Summary</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Patient Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Details</h2>

                            <div className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                                    <Input
                                        placeholder="Enter your name"
                                        value={formData.patientName}
                                        onChange={(e) => handleInputChange("patientName", e.target.value)}
                                        className={`rounded-xl h-12 bg-gray-50 border-gray-200 focus:ring-[#2BBBC5]/20 focus:border-[#2BBBC5] ${errors.patientName ? "border-red-500" : ""}`}
                                    />
                                    {errors.patientName && <p className="text-sm text-red-500">{errors.patientName}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                    <Input
                                        placeholder="Enter your phone number"
                                        value={formData.patientPhone}
                                        onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                                        className={`rounded-xl h-12 bg-gray-50 border-gray-200 focus:ring-[#2BBBC5]/20 focus:border-[#2BBBC5] ${errors.patientPhone ? "border-red-500" : ""}`}
                                    />
                                    {errors.patientPhone && <p className="text-sm text-red-500">{errors.patientPhone}</p>}
                                </div>

                                {/* Age & Gender */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Age</Label>
                                        <Input
                                            type="number"
                                            placeholder="Age"
                                            value={formData.patientAge}
                                            onChange={(e) => handleInputChange("patientAge", e.target.value)}
                                            className={`rounded-xl h-12 bg-gray-50 border-gray-200 focus:ring-[#2BBBC5]/20 focus:border-[#2BBBC5] ${errors.patientAge ? "border-red-500" : ""}`}
                                        />
                                        {errors.patientAge && <p className="text-sm text-red-500">{errors.patientAge}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Gender</Label>
                                        <div className="flex gap-4 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientGender === 'male' ? 'border-[#2BBBC5]' : 'border-gray-300'}`}>
                                                    {formData.patientGender === 'male' && <div className="w-3 h-3 rounded-full bg-[#2BBBC5]" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    checked={formData.patientGender === 'male'}
                                                    onChange={() => handleInputChange("patientGender", "male")}
                                                />
                                                <span className="text-sm font-medium text-gray-700">Male</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientGender === 'female' ? 'border-[#2BBBC5]' : 'border-gray-300'}`}>
                                                    {formData.patientGender === 'female' && <div className="w-3 h-3 rounded-full bg-[#2BBBC5]" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    checked={formData.patientGender === 'female'}
                                                    onChange={() => handleInputChange("patientGender", "female")}
                                                />
                                                <span className="text-sm font-medium text-gray-700">Female</span>
                                            </label>
                                        </div>
                                        {errors.patientGender && <p className="text-sm text-red-500">{errors.patientGender}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Doctor & Payment Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Doctor Info Card */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                            <div className="flex gap-4 items-start mb-6">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                                    <Image
                                        src={doctor.doctorImage || "/placeholder-doctor.jpg"}
                                        alt={doctor.username}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1">Dr. {doctor.username}</h3>
                                    <p className="text-sm text-gray-500 mb-1">{doctor.specialty}</p>
                                    {doctor.isApproved && (
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                            <BadgeCheck className="w-3 h-3" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Clinic</p>
                                        <p className="text-sm font-semibold text-gray-900">{doctor.clinicName}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {[doctor.street, doctor.city, doctor.country].filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Date</p>
                                        <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Time</p>
                                        <p className="text-sm font-semibold text-gray-900">{formattedTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-semibold text-gray-900">${consultationFee}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Service Charge</span>
                                    <span className="font-semibold text-gray-900">${serviceCharge}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-black text-[#2BBBC5]">${totalAmount}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="w-full bg-[#2BBBC5] hover:bg-[#25A0A9] text-white rounded-xl h-12 font-bold shadow-lg shadow-[#2BBBC5]/20 transition-all active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Confirm & Pay"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AppointmentSummaryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#2BBBC5]" /></div>}>
            <AppointmentSummaryContent />
        </Suspense>
    );
}
