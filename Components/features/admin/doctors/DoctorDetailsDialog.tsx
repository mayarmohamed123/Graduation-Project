import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { AdminDoctor } from "@/types/admin";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { MapPin, Phone, Building, Star, Users, DollarSign } from "lucide-react";

interface DoctorDetailsDialogProps {
    doctor: AdminDoctor | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: number, data: Partial<AdminDoctor>) => Promise<void>;
}

export function DoctorDetailsDialog({
    doctor,
    isOpen,
    onClose,
    onUpdate,
}: DoctorDetailsDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<AdminDoctor>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctor) {
            setFormData(doctor);
        }
        setIsEditing(false);
    }, [doctor, isOpen]);

    if (!doctor) return null;

    const handleSave = async () => {
        try {
            setLoading(true);
            await onUpdate(doctor.id, formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update doctor:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border">
                                {doctor.doctorImage ? (
                                    <Image
                                        src={doctor.doctorImage}
                                        alt={doctor.email}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                                        {doctor.email?.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-xl">
                                    {isEditing ? (
                                        <Input
                                            value={formData.username || ""}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            className="h-8 text-lg font-semibold px-1"
                                        />
                                    ) : (
                                        doctor.username || doctor.email.split('@')[0]
                                    )}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-1">
                                    {doctor.email}
                                    <Badge variant={doctor.isApproved ? "default" : "secondary"} className={doctor.isApproved ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"}>
                                        {doctor.isApproved ? "Approved" : "Pending"}
                                    </Badge>
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Stats Section */}
                    {!isEditing && (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                                    <Users className="w-4 h-4" />
                                    <span className="font-semibold">{doctor.countPatient}</span>
                                </div>
                                <div className="text-xs text-blue-600/80">Patients</div>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
                                    <Star className="w-4 h-4 fill-amber-600" />
                                    <span className="font-semibold">{doctor.averageRating?.toFixed(1) || 0}</span>
                                </div>
                                <div className="text-xs text-amber-600/80">Rating</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-1.5 text-purple-600 mb-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-semibold">{doctor.consultationPrice}</span>
                                </div>
                                <div className="text-xs text-purple-600/80">Price</div>
                            </div>
                        </div>
                    )}

                    {/* Professional Info */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 border-b pb-2">Professional Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Specialty</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.specialty || ""}
                                        onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-sm font-medium">{doctor.specialty}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Consultation Price</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.consultationPrice || 0}
                                        onChange={e => setFormData({ ...formData, consultationPrice: Number(e.target.value) })}
                                    />
                                ) : (
                                    <div className="text-sm font-medium">${doctor.consultationPrice}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Consultation Type</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.consultationType || ""}
                                        onChange={e => setFormData({ ...formData, consultationType: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-sm font-medium capitalize">{doctor.consultationType}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 h-10">
                                        <input
                                            type="checkbox"
                                            checked={formData.isApproved}
                                            onChange={e => setFormData({ ...formData, isApproved: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">{formData.isApproved ? "Approved" : "Pending"}</span>
                                    </div>
                                ) : (
                                    <div className="text-sm font-medium">{doctor.isApproved ? "Active" : "Pending Approval"}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Clinic Info */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Clinic Information
                        </h3>

                        <div className="flex gap-4 mb-4">
                            <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                                {doctor.clinicImagePath ? (
                                    <Image
                                        src={doctor.clinicImagePath}
                                        alt={doctor.clinicName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Building className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Clinic Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.clinicName || ""}
                                            onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-sm font-medium">{doctor.clinicName}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Phone className="w-3 h-3" /> Phone
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.clinicPhone || ""}
                                        onChange={e => setFormData({ ...formData, clinicPhone: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-sm">{doctor.clinicPhone}</div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="w-3 h-3" /> Location
                                </Label>
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="City"
                                            value={formData.city || ""}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Street"
                                            value={formData.street || ""}
                                            onChange={e => setFormData({ ...formData, street: e.target.value })}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm">
                                        {doctor.street}, {doctor.city}, {doctor.country}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onClose}>Close</Button>
                            <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
