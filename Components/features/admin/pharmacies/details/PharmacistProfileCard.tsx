import { Mail, Phone, MapPin, ShieldCheck, User as UserIcon } from "lucide-react";
import { AdminPharmacist } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface PharmacistProfileCardProps {
    pharmacist: AdminPharmacist;
}

export function PharmacistProfileCard({ pharmacist }: PharmacistProfileCardProps) {
    return (
        <Card className="border-[#2BBBC5] border-2 bg-[#2BBBC5]/10 shadow-sm overflow-hidden sticky top-6">
            <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                        <AvatarImage src={pharmacist.pharmacistImage || ""} className="object-cover" />
                        <AvatarFallback className="bg-white text-[#2BBBC5] text-2xl font-bold">
                            {pharmacist.userName?.[0]?.toUpperCase() || pharmacist.email[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">{pharmacist.userName}</CardTitle>
                <p className="text-[#2BBBC5] font-medium text-sm">Registered Pharmacist</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <UserIcon className="h-4 w-4 text-[#2BBBC5]" />
                        <span className="text-gray-600">{pharmacist.userName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-[#2BBBC5]" />
                        <span className="text-gray-600 truncate">{pharmacist.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-[#2BBBC5]" />
                        <span className="text-gray-600">{pharmacist.pharmacyPhone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <ShieldCheck className="h-4 w-4 text-[#2BBBC5]" />
                        <span className="text-gray-600">License: {pharmacist.licenseNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-[#2BBBC5]" />
                        <span className="text-gray-600">{pharmacist.city}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
