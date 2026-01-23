"use client";

import { useEffect, useState } from "react";
import { bloodRequestService } from "@/Services/bloodRequestService";
import { BloodRequest } from "@/types/blood";
import { toast } from "react-hot-toast";
import { MapPin, Clock, Edit2, Trash2, Droplet } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { ConfirmationDialog } from "@/Components/ui/confirmation-dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import dynamic from "next/dynamic";
import { formatBloodType } from "@/lib/bloodUtils";

const LocationPickerMap = dynamic(() => import("@/Components/features/donation/LocationPickerMap"), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

const bloodTypes = [
    { id: 0, label: "A+" },
    { id: 1, label: "A-" },
    { id: 2, label: "B+" },
    { id: 3, label: "B-" },
    { id: 4, label: "AB+" },
    { id: 5, label: "AB-" },
    { id: 6, label: "O+" },
    { id: 7, label: "O-" },
];

const bloodTypeToId: Record<string, number> = {
    "apos": 0, "aneg": 1, "bpos": 2, "bneg": 3, "abpos": 4, "abneg": 5, "opos": 6, "oneg": 7
};

export default function MyBloodRequests() {
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
    const [requestToDelete, setRequestToDelete] = useState<BloodRequest | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Update Form State
    const [updateFormData, setUpdateFormData] = useState({
        RequiredType: 0,
        HospitalName: "",
        HospitalCity: "",
        HospitalCountry: "Egypt",
        HospitalLatitude: 30.764,
        HospitalLongitude: 32.954,
        Units: 1,
        NeedWithin: "24 hours",
    });

    const fetchRequests = async () => {
        try {
            const data = await bloodRequestService.getMyRequests();
            setRequests(data);
        } catch (_error) {
            toast.error("Failed to load your blood requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openDeleteModal = (request: BloodRequest) => {
        setRequestToDelete(request);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!requestToDelete) return;

        setIsDeleting(true);
        try {
            await bloodRequestService.deleteBloodRequest(requestToDelete.id);
            toast.success("Request deleted successfully");
            setRequests(prev => prev.filter(r => r.id !== requestToDelete.id));
            setIsDeleteOpen(false);
            setRequestToDelete(null);
        } catch (_error) {
            toast.error("Failed to delete request");
        } finally {
            setIsDeleting(false);
        }
    };

    const openUpdateModal = (request: BloodRequest) => {
        const typeId = bloodTypeToId[request.requiredType.toLowerCase()] ?? 0;
        setSelectedRequest(request);
        setUpdateFormData({
            RequiredType: typeId,
            HospitalName: request.hospitalName,
            HospitalCity: request.city,
            HospitalCountry: request.country,
            HospitalLatitude: request.latitude,
            HospitalLongitude: request.longitude,
            Units: request.units,
            NeedWithin: request.needWithin,
        });
        setIsUpdateOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedRequest) return;
        try {
            await bloodRequestService.updateBloodRequest(selectedRequest.id, updateFormData);
            toast.success("Request updated successfully");
            setIsUpdateOpen(false);
            fetchRequests();
        } catch (_error) {
            toast.error("Failed to update request");
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
            <h2 className="text-2xl font-bold text-gray-900">My Blood Requests</h2>

            {requests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">You haven&apos;t made any blood requests yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-3 flex-1">
                                <h3 className="text-xl font-bold text-primary">{request.hospitalName}</h3>

                                <div className="flex flex-col gap-1">
                                    <p className="text-lg font-semibold text-gray-800">
                                        Type: <span className="text-primary">{formatBloodType(request.requiredType)}</span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        Units: <span className="text-primary">{request.units}</span>
                                    </p>
                                    <p className="text-sm font-medium text-amber-600">
                                        Need Within: {request.needWithin}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{request.city}, {request.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Clock size={16} className="text-primary" />
                                        <span>Posted: {new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openUpdateModal(request)}
                                    className="flex-1 md:flex-none gap-2 rounded-xl"
                                >
                                    <Edit2 size={16} /> Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteModal(request)}
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
                title="Delete Blood Request"
                description={`Are you sure you want to delete your blood request for ${requestToDelete?.hospitalName}? This action cannot be undone.`}
                confirmText="Delete Request"
                variant="destructive"
                loading={isDeleting}
            />

            <ConfirmationDialog
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                onConfirm={handleUpdate}
                title="Update Blood Request"
                confirmText="Update Request"
                description="Adjust the details of your blood request below."
            >
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Blood Type</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={updateFormData.RequiredType}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, RequiredType: Number(e.target.value) })}
                            >
                                {bloodTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Units</Label>
                            <Input
                                type="number"
                                value={updateFormData.Units}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, Units: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Urgency</Label>
                        <Input
                            value={updateFormData.NeedWithin}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, NeedWithin: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Hospital Name</Label>
                        <Input
                            value={updateFormData.HospitalName}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, HospitalName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                value={updateFormData.HospitalCity}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, HospitalCity: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                                value={updateFormData.HospitalCountry}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, HospitalCountry: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Hospital Location</Label>
                        <LocationPickerMap
                            lat={updateFormData.HospitalLatitude}
                            lng={updateFormData.HospitalLongitude}
                            onChange={(lat, lng) => setUpdateFormData({ ...updateFormData, HospitalLatitude: lat, HospitalLongitude: lng })}
                        />
                    </div>
                </div>
            </ConfirmationDialog>
        </div>
    );
}
