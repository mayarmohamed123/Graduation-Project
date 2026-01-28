import { Mail, Phone, MapPin, User as UserIcon, Pencil } from "lucide-react";
import { AdminPharmacist } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditPharmacistProfileDialog } from "./EditPharmacistProfileDialog";

interface PharmacistProfileCardProps {
    pharmacist: AdminPharmacist;
    onRefresh: () => void;
}

export function PharmacistProfileCard({ pharmacist, onRefresh }: PharmacistProfileCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Card className="border-[#2BBBC5] border-2 bg-[#2BBBC5]/10 shadow-sm overflow-hidden sticky top-6">
                <CardHeader className="text-center pb-2 relative">
                    <div className="absolute top-2 right-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-[#2BBBC5] hover:text-[#25a0a9] hover:bg-[#2BBBC5]/10"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>
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
                            <MapPin className="h-4 w-4 text-[#2BBBC5]" />
                            <span className="text-gray-600">{pharmacist.city}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditPharmacistProfileDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
                pharmacist={pharmacist} 
                onSuccess={onRefresh} 
            />
        </>
    );
}
