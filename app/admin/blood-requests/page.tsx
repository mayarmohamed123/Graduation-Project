"use client";

import { useEffect, useState } from "react";
import { Droplet, Activity, CheckCircle, AlertCircle, Users, RefreshCw } from "lucide-react";
import { adminBloodService, UpdateBloodRequestData } from "@/Services/admin/adminBloodService";
import { BloodRequest, AdminBloodDonation } from "@/types/blood";
import { toast } from "react-hot-toast";
import StatisticsCard from "@/components/features/doctor/StatisticsCard";
import { BloodRequestsTable } from "@/components/features/admin/blood/BloodRequestsTable";
import { BloodDonationsTable } from "@/components/features/admin/blood/BloodDonationsTable";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { EditRequestDialog } from "@/components/features/admin/blood/EditRequestDialog";
import { Skeleton, Button } from "@/components/ui";

type TabType = "requests" | "donations";

export default function AdminBloodPage() {
    const [activeTab, setActiveTab] = useState<TabType>("requests");
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [donations, setDonations] = useState<AdminBloodDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; type: TabType } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [requestToEdit, setRequestToEdit] = useState<BloodRequest | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch requests with fallback
            let requestsData: BloodRequest[] = [];
            try {
                requestsData = await adminBloodService.getAllBloodRequests();
                console.log("Blood requests fetched:", requestsData);
            } catch (err) {
                console.error("Failed to fetch blood requests:", err);
            }

            // Fetch donations with fallback
            let donationsData: AdminBloodDonation[] = [];
            try {
                donationsData = await adminBloodService.getAllBloodDonations();
                console.log("Blood donations fetched:", donationsData);
            } catch (err) {
                console.error("Failed to fetch blood donations:", err);
            }

            setRequests(Array.isArray(requestsData) ? requestsData : []);
            setDonations(Array.isArray(donationsData) ? donationsData : []);
        } catch (error) {
            console.error("Failed to fetch blood data:", error);
            setError("Failed to load blood management data. Please try again.");
            toast.error("Failed to load blood management data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (id: number) => {
        setItemToDelete({ id, type: "requests" });
        setDeleteDialogOpen(true);
    };

    const handleDeleteDonation = (id: number) => {
        setItemToDelete({ id, type: "donations" });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        try {
            if (itemToDelete.type === "requests") {
                await adminBloodService.deleteBloodRequest(itemToDelete.id);
                setRequests((prev) => prev.filter((r) => r.id !== itemToDelete.id));
                toast.success("Blood request deleted successfully");
            } else {
                await adminBloodService.deleteBloodDonation(itemToDelete.id);
                setDonations((prev) => prev.filter((d) => d.id !== itemToDelete.id));
                toast.success("Blood donation deleted successfully");
            }
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete:", error);
            toast.error("Failed to delete item");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditRequest = (request: BloodRequest) => {
        setRequestToEdit(request);
        setEditDialogOpen(true);
    };

    const handleSaveRequest = async (id: number, data: UpdateBloodRequestData) => {
        try {
            await adminBloodService.updateBloodRequest(id, data);

            // Refresh local state without full reload
            setRequests((prev) =>
                prev.map((r) => {
                    if (r.id === id) {
                        return {
                            ...r,
                            units: data.Units ?? r.units,
                            hospitalName: data.HospitalName ?? r.hospitalName,
                            city: data.HospitalCity ?? r.city,
                            country: data.HospitalCountry ?? r.country,
                            latitude: data.HospitalLatitude ?? r.latitude,
                            longitude: data.HospitalLongitude ?? r.longitude,
                            needWithin: data.NeedWithin ?? r.needWithin,
                            fulfilled: data.Fulfilled ?? r.fulfilled
                        };
                    }
                    return r;
                })
            );

            toast.success("Blood request updated successfully");
        } catch (error) {
            console.error("Failed to update blood request:", error);
            toast.error("Failed to update blood request");
            throw error; // Re-throw to keep modal open on fail if desired (handled in Dialog)
        }
    };

    // Calculate statistics with safety checks
    const totalRequests = Array.isArray(requests) ? requests.length : 0;
    const fulfilledRequests = Array.isArray(requests) ? requests.filter((r) => r?.fulfilled).length : 0;
    const unfulfilledRequests = Array.isArray(requests) ? requests.filter((r) => !r?.fulfilled).length : 0;
    const totalDonations = Array.isArray(donations) ? donations.length : 0;
    const availableDonors = Array.isArray(donations) ? donations.filter((d) => d?.isAvailable).length : 0;

    const statCards = [
        {
            title: "Total Requests",
            value: totalRequests,
            icon: <Droplet className="w-6 h-6 text-red-600" />,
            bgColor: "bg-red-50",
        },
        {
            title: "Fulfilled Requests",
            value: fulfilledRequests,
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            bgColor: "bg-green-50",
        },
        {
            title: "Pending Requests",
            value: unfulfilledRequests,
            icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
            bgColor: "bg-amber-50",
        },
        {
            title: "Total Donations",
            value: totalDonations,
            icon: <Activity className="w-6 h-6 text-blue-600" />,
            bgColor: "bg-blue-50",
        },
        {
            title: "Available Donors",
            value: availableDonors,
            icon: <Users className="w-6 h-6 text-purple-600" />,
            bgColor: "bg-purple-50",
        },
    ];

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))}
                </div>
                <Skeleton className="h-[500px] w-full rounded-2xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blood Management</h1>
                    <p className="text-gray-500">
                        Manage blood requests and donations across the platform
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button
                        onClick={fetchData}
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Blood Management</h1>
                <p className="text-gray-500">
                    Manage blood requests and donations across the platform
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map((card, index) => (
                    <StatisticsCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        bgColor={card.bgColor}
                    />
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "requests"
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Blood Requests ({totalRequests})
                        </button>
                        <button
                            onClick={() => setActiveTab("donations")}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "donations"
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Blood Donations ({totalDonations})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "requests" ? (
                        <BloodRequestsTable
                            requests={requests}
                            loading={false}
                            onDelete={handleDeleteRequest}
                            onEdit={handleEditRequest}
                        />
                    ) : (
                        <BloodDonationsTable
                            donations={donations}
                            loading={false}
                            onDelete={handleDeleteDonation}
                        />
                    )}
                </div>
            </div>

            {/* Edit Blood Request Dialog */}
            <EditRequestDialog
                isOpen={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSaveRequest}
                request={requestToEdit}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={`Delete ${itemToDelete?.type === "requests" ? "Blood Request" : "Blood Donation"}`}
                description={`Are you sure you want to delete this ${itemToDelete?.type === "requests" ? "blood request" : "blood donation"
                    }? This action cannot be undone.`}
                confirmText="Delete"
                variant="destructive"
                loading={isDeleting}
            />
        </div>
    );
}
