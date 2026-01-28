"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Building2, Mail, Phone, MapPin, ShieldCheck, User } from "lucide-react";
import { AdminPharmacist } from "@/types/admin";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PharmacyDetailsDialogProps {
    pharmacist: AdminPharmacist | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userId: string, data: Partial<AdminPharmacist>) => Promise<void>;
}

export function PharmacyDetailsDialog({ pharmacist, isOpen, onClose, onUpdate }: PharmacyDetailsDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<AdminPharmacist>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (pharmacist) {
            setFormData({
                pharmacyName: pharmacist.pharmacyName,
                pharmacyPhone: pharmacist.pharmacyPhone,
                city: pharmacist.city,
                licenseNumber: pharmacist.licenseNumber
            });
        }
        setIsEditing(false);
    }, [pharmacist]);

    if (!pharmacist) return null;

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onUpdate(pharmacist.userId, formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update pharmacist:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Pharmacist & Pharmacy Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* Header Info Section */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <Avatar className="h-24 w-24 border-2 border-primary/10">
                                <AvatarImage src={pharmacist.pharmacistImage || ""} className="object-cover" />
                                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                                    {pharmacist.email[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {pharmacist.isApproved ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Verified
                                </Badge>
                            ) : pharmacist.isReject ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Rejected
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    Pending
                                </Badge>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                                {pharmacist.pharmacyImagePath ? (
                                    <Image src={pharmacist.pharmacyImagePath} alt="Pharmacy" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Building2 className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5" /> Pharmacy Name
                            </Label>
                            {isEditing ? (
                                <Input 
                                    value={formData.pharmacyName || ""} 
                                    onChange={(e) => setFormData({...formData, pharmacyName: e.target.value})}
                                />
                            ) : (
                                <p className="text-sm font-semibold h-10 flex items-center px-1">{pharmacist.pharmacyName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Email Address
                            </Label>
                            <p className="text-sm font-medium text-muted-foreground h-10 flex items-center px-1">{pharmacist.email}</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> Pharmacy Phone
                            </Label>
                            {isEditing ? (
                                <Input 
                                    value={formData.pharmacyPhone || ""} 
                                    onChange={(e) => setFormData({...formData, pharmacyPhone: e.target.value})}
                                />
                            ) : (
                                <p className="text-sm font-semibold h-10 flex items-center px-1">{pharmacist.pharmacyPhone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" /> City Location
                            </Label>
                            {isEditing ? (
                                <Input 
                                    value={formData.city || ""} 
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                />
                            ) : (
                                <p className="text-sm font-semibold h-10 flex items-center px-1">{pharmacist.city}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> License Number
                            </Label>
                            {isEditing ? (
                                <Input 
                                    value={formData.licenseNumber || ""} 
                                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                                />
                            ) : (
                                <p className="text-sm font-mono h-10 flex items-center px-1">{pharmacist.licenseNumber}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> User ID
                            </Label>
                            <p className="text-[11px] font-mono text-muted-foreground break-all h-10 flex items-center px-1 leading-tight">
                                {pharmacist.userId}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 border-t pt-4">
                    {isEditing ? (
                        <>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <Button size="sm" onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700">
                            Edit Profile
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
