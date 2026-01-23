"use client";

import React, { useEffect, useState } from "react";
import { Search, MapPin, List, Map as MapIcon, Loader2, Droplet } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import dynamic from "next/dynamic";
import { bloodRequestService } from "@/Services/bloodRequestService";
import { authService } from "@/Services/authService";
import { BloodRequestWithPriority, PriorityLevel } from "@/types/blood";
import BloodRequestCard from "@/Components/features/donation/BloodRequestCard";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "@/Components/ui/confirmation-dialog";

const BloodDriveMap = dynamic(() => import("@/Components/features/donation/BloodDriveMap"), {
    ssr: false,
    loading: () => <LoadingSpinner />,
});

export default function BloodDriveSearchPage() {
    const [requests, setRequests] = useState<BloodRequestWithPriority[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<BloodRequestWithPriority[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequestWithPriority | null>(null);

    // Donor Form State
    const [donorCity, setDonorCity] = useState("");
    const [donorCountry, setDonorCountry] = useState("Egypt");
    const [donorPhone, setDonorPhone] = useState("");
    const [donorLat, setDonorLat] = useState<number | null>(null);
    const [donorLng, setDonorLng] = useState<number | null>(null);

    useEffect(() => {
        // Fetch User Profile to pre-fill form
        const fetchProfile = async () => {
            try {
                const profile = await authService.getProfile();
                if (profile) {
                    setDonorPhone(profile.phoneNumber || "");
                    if (profile.address) {
                        // Simple heuristic: if address contains comma, use first part as city
                        const parts = profile.address.split(",");
                        if (parts.length > 0) setDonorCity(parts[0].trim());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        // Get initial location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setDonorLat(pos.coords.latitude);
                    setDonorLng(pos.coords.longitude);
                },
                (err) => console.log("Initial location fetch failed:", err)
            );
        }

        fetchProfile();
    }, []);

    const determinePriority = (needWithin: string): PriorityLevel => {
        const lower = needWithin.toLowerCase();
        if (lower.includes("urgent") || lower.includes("24 hours") || lower.includes("now")) return "Urgent";
        if (lower.includes("48 hours") || lower.includes("72 hours") || lower.includes("2-3 days")) return "High";
        return "Regular";
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await bloodRequestService.getUnfulfilledRequests();
                const requestsWithPriority = data.map(req => ({
                    ...req,
                    priority: determinePriority(req.needWithin)
                }));
                // Sort by priority (Urgent > High > Regular)
                const priorityOrder: Record<PriorityLevel, number> = { Urgent: 0, High: 1, Regular: 2 };
                requestsWithPriority.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

                setRequests(requestsWithPriority);
                setFilteredRequests(requestsWithPriority);
            } catch (error) {
                toast.error("Failed to load blood requests");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    useEffect(() => {
        const filtered = requests.filter(req =>
            req.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.requiredType.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRequests(filtered);
    }, [searchQuery, requests]);

    const handleUseMyLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, we might reverse geocode or filter by proximity
                    // For now, let's just show a toast and maybe switch to map view
                    console.log("Location detected:", position);
                    toast.success("Location detected!");
                    setViewMode("map");
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Could not access location");
                }
            );
        } else {
            toast.error("Geolocation not supported");
        }
    };

    const handleDonate = (request: BloodRequestWithPriority) => {
        setSelectedRequest(request);
        setIsDonateDialogOpen(true);
    };

    const handleConfirmDonate = async () => {
        if (!selectedRequest) return;

        // Ensure we have location
        const lat = donorLat;
        const lng = donorLng;

        if (lat === null || lng === null) {
            toast.error("Please enable location access to proceed with donation.");
            return;
        }

        if (!donorCity || !donorCountry || !donorPhone) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await bloodRequestService.donateBlood({
                BloodRequestId: selectedRequest.id,
                Latitude: lat,
                Longitude: lng,
                City: donorCity,
                Country: donorCountry,
                PhoneNumber: donorPhone
            });
            toast.success(response.message || "Donor Donated successfully!");
            setIsDonateDialogOpen(false);
            setSelectedRequest(null);
        } catch (error) {
            console.error("Donation error:", error);
            toast.error("Failed to process donation. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Finding blood drives near you...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
            {/* Header Section */}
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-[#2BBBC5] tracking-tight">Find a Blood Drive Near You</h1>

                <div className="flex flex-col md:flex-row gap-4 items-center w-full justify-between">
                    <div className="relative w-full md:flex-1">
                        <Input
                            placeholder="City or Address"
                            className="h-14 w-full rounded-full pl-6 pr-12 text-lg border-gray-200 focus:border-primary transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
                    </div>

                    <Button
                        onClick={handleUseMyLocation}
                        className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                    >
                        <MapPin size={20} />
                        Use My Location
                    </Button>
                </div>

            </div>

            {/* View Toggle */}
            <div className="flex justify-end pr-2">
                <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === "list"
                            ? "bg-[#2BBBC5] text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <List size={18} />
                        List
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === "map"
                            ? "bg-[#2BBBC5] text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <MapIcon size={18} />
                        Map
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(request => (
                                <BloodRequestCard
                                    key={request.id}
                                    request={request}
                                    onDonate={handleDonate}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No blood requests found matching your search.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-[600px] w-full">
                        <BloodDriveMap requests={filteredRequests} />
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={isDonateDialogOpen}
                onClose={() => setIsDonateDialogOpen(false)}
                onConfirm={handleConfirmDonate}
                title="Confirm Donation Interest"
                description=""
                confirmText="Yes, I want to donate"
                cancelText="Maybe later"
                loading={submitting}
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                        Building a healthier community together! Please confirm your information to donate {selectedRequest?.requiredType} blood at {selectedRequest?.hospitalName}.
                    </p>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={donorCity}
                                onChange={(e) => setDonorCity(e.target.value)}
                                placeholder="Enter your city"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={donorCountry}
                                onChange={(e) => setDonorCountry(e.target.value)}
                                placeholder="Enter your country"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={donorPhone}
                                onChange={(e) => setDonorPhone(e.target.value)}
                                placeholder="01xxxxxxxxx"
                            />
                        </div>
                        {(donorLat === null || donorLng === null) && (
                            <p className="text-xs text-amber-600 font-medium">
                                * Location access is required for donation.
                            </p>
                        )}
                    </div>
                </div>
            </ConfirmationDialog>
        </div>
    );
}
