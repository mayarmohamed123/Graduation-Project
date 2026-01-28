"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BloodRequest } from "@/types/blood";
import { UpdateBloodRequestData } from "@/Services/admin/adminBloodService";
import { bloodTypeToEnum } from "@/lib/bloodUtils";

interface EditRequestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: UpdateBloodRequestData) => Promise<void>;
    request: BloodRequest | null;
}

export function EditRequestDialog({
    isOpen,
    onClose,
    onSave,
    request,
}: EditRequestDialogProps) {
    const [formData, setFormData] = useState<Partial<BloodRequest>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (request) {
            setFormData({ ...request });
        }
    }, [request]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request || !formData) return;

        setLoading(true);
        try {
            // Map form data to update object
            const updateData: UpdateBloodRequestData = {
                RequiredType: bloodTypeToEnum(formData.requiredType || ""),
                HospitalLatitude: formData.latitude,
                HospitalLongitude: formData.longitude,
                HospitalCity: formData.city,
                HospitalCountry: formData.country,
                HospitalName: formData.hospitalName,
                Units: formData.units,
                NeedWithin: formData.needWithin,
                Fulfilled: formData.fulfilled,
            };

            await onSave(request.id, updateData);
            onClose();
        } catch (error) {
            console.error("Failed to update request:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!request) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Blood Request</DialogTitle>
                    <DialogDescription>
                        Update the details of the blood request. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="requiredType">Blood Type</Label>
                            <select
                                id="requiredType"
                                name="requiredType"
                                value={formData.requiredType || ""}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="apos">A+</option>
                                <option value="aneg">A-</option>
                                <option value="bpos">B+</option>
                                <option value="bneg">B-</option>
                                <option value="abpos">AB+</option>
                                <option value="abneg">AB-</option>
                                <option value="opos">O+</option>
                                <option value="oneg">O-</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="units">Units</Label>
                            <Input
                                id="units"
                                name="units"
                                type="number"
                                value={formData.units || 0}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hospitalName">Hospital Name</Label>
                        <Input
                            id="hospitalName"
                            name="hospitalName"
                            value={formData.hospitalName || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                value={formData.latitude || 0}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                value={formData.longitude || 0}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="needWithin">Need Within</Label>
                        <Input
                            id="needWithin"
                            name="needWithin"
                            value={formData.needWithin || ""}
                            onChange={handleChange}
                            placeholder="e.g. 48 hours"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="fulfilled"
                            name="fulfilled"
                            checked={!!formData.fulfilled}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="fulfilled">Mark as Fulfilled</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
