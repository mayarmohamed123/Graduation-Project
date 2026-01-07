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
import { AdminDoctor, DoctorProfileData, ClinicInfoData } from "@/types/admin";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { MapPin, Phone, Building, Star, Users, DollarSign } from "lucide-react";

interface DoctorDetailsDialogProps {
    doctor: AdminDoctor | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: number, profileData: DoctorProfileData, clinicData: ClinicInfoData) => Promise<void>;
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

    const [selectedDoctorImage, setSelectedDoctorImage] = useState<File | null>(null);
    const [selectedClinicImage, setSelectedClinicImage] = useState<File | null>(null);
    const [previewDoctorImage, setPreviewDoctorImage] = useState<string | null>(null);
    const [previewClinicImage, setPreviewClinicImage] = useState<string | null>(null);

    useEffect(() => {
        if (doctor) {
            setFormData(doctor);
            setPreviewDoctorImage(doctor.doctorImage);
            setPreviewClinicImage(doctor.clinicImagePath);
        }
        setIsEditing(false);
        setSelectedDoctorImage(null);
        setSelectedClinicImage(null);
    }, [doctor, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'doctor' | 'clinic') => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'doctor') {
                setSelectedDoctorImage(file);
                setPreviewDoctorImage(previewUrl);
            } else {
                setSelectedClinicImage(file);
                setPreviewClinicImage(previewUrl);
            }
        }
    };

    if (!doctor) return null;

    const handleSave = async () => {
        try {
            setLoading(true);

            // Prepare doctor profile data - only include changed fields
            const profileData: DoctorProfileData = {};

            if (formData.username !== doctor.username) {
                profileData.username = formData.username;
            }
            if (formData.email !== doctor.email) {
                profileData.email = formData.email;
            }
            if (formData.specialty !== doctor.specialty) {
                profileData.specialty = formData.specialty;
            }
            if (formData.consultationPrice !== doctor.consultationPrice) {
                profileData.consultationPrice = formData.consultationPrice;
            }
            if (formData.consultationType !== doctor.consultationType) {
                profileData.consultationType = formData.consultationType;
            }
            if (selectedDoctorImage) {
                profileData.image = selectedDoctorImage;
            }

            // Prepare clinic data - only include changed fields
            const clinicData: ClinicInfoData = {};

            if (formData.clinicName !== doctor.clinicName) {
                clinicData.name = formData.clinicName;
            }
            if (formData.clinicPhone !== doctor.clinicPhone) {
                clinicData.Phone = formData.clinicPhone;
            }
            if (formData.city !== doctor.city) {
                clinicData.city = formData.city;
            }
            if (formData.street !== doctor.street) {
                clinicData.street = formData.street;
            }
            if (formData.country !== doctor.country) {
                clinicData.country = formData.country;
            }
            if (selectedClinicImage) {
                clinicData.image = selectedClinicImage;
            }

            await onUpdate(doctor.id, profileData, clinicData);
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
                            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border group">
                                {previewDoctorImage ? (
                                    <Image
                                        src={previewDoctorImage}
                                        alt={doctor.email}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 100px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                                        {doctor.email?.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                {isEditing && (
                                    <>
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => document.getElementById('doctor-image-upload')?.click()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                                <circle cx="12" cy="13" r="3" />
                                            </svg>
                                        </div>
                                        <input
                                            id="doctor-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'doctor')}
                                        />
                                    </>
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
                            <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border group">
                                {previewClinicImage ? (
                                    <Image
                                        src={previewClinicImage}
                                        alt={doctor.clinicName}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 150px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Building className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                {isEditing && (
                                    <>
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => document.getElementById('clinic-image-upload')?.click()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                                <circle cx="12" cy="13" r="3" />
                                            </svg>
                                        </div>
                                        <input
                                            id="clinic-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'clinic')}
                                        />
                                    </>
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
                    ) : doctor.isApproved ? (
                        <>
                            <Button variant="outline" onClick={onClose}>Close</Button>
                            <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onClose}>Close</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
