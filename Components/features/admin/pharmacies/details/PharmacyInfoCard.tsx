import { Building2, Globe, Star, Pencil } from "lucide-react";
import Image from "next/image";
import { AdminPharmacyDetails } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { EditPharmacyDialog } from "./EditPharmacyDialog";

interface PharmacyInfoCardProps {
    pharmacy: AdminPharmacyDetails;
    userId: string;
    onRefresh: () => void;
}

export function PharmacyInfoCard({ pharmacy, userId, onRefresh }: PharmacyInfoCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Card className="shadow-sm h-full flex flex-col">
                <CardHeader className="border-b pb-4 relative">
                    <div className="absolute top-2 right-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                        Pharmacy Information
                          <div className="flex items-center gap-2 justify-center bg-yellow-50 p-2 rounded-md border border-yellow-100">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold text-gray-700">{pharmacy.averageRating.toFixed(1)}</span>
                            </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="space-y-4">
                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-gray-50">
                                {pharmacy.imagePath ? (
                                    <Image src={pharmacy.imagePath} alt={pharmacy.name} fill className="object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-300">
                                        <Building2 className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                          
                        </div>
                        <div className="space-y-4 flex flex-col justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Pharmacy Name</p>
                                    <p className="text-sm font-semibold">{pharmacy.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Phone</p>
                                    <p className="text-sm font-semibold">{pharmacy.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Location</p>
                                    <p className="text-sm font-semibold">{pharmacy.city}, {pharmacy.country}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Delivery Fee</p>
                                    <p className="text-sm font-semibold">${pharmacy.deliveryFee.toFixed(2)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Address</p>
                                    <p className="text-sm">{pharmacy.street}, {pharmacy.postalCode}</p>
                                </div>
                            </div>
                            <div className="pt-2 flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Lat: {pharmacy.latitude.toFixed(4)}
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Long: {pharmacy.longitude.toFixed(4)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditPharmacyDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
                pharmacy={pharmacy}
                userId={userId}
                onSuccess={onRefresh} 
            />
        </>
    );
}
