"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Camera, Building2, MapPin, DollarSign, Award, Loader2, Phone, Hash, Map as MapIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { pharmacistService } from "@/Services/pharmacistService";
import toast from "react-hot-toast";

const LocationMap = dynamic(() => import("@/Components/common/LocationMap"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading Map...</div>
});

export default function PharmacyInformation() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Map state
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        country: "",
        city: "",
        Street: "",
        PostalCode: "",
        Latitude: "",
        Longitude: "",
        DeliveryFee: "",
        LicenseNumber: "",
    });

    useEffect(() => {
        const fetchPharmacyData = async () => {
            try {
                setIsFetching(true);
                const data = await pharmacistService.getPharmacyProfile();
                setFormData({
                    name: data.name || "",
                    phone: data.phone || "",
                    country: data.country || "",
                    city: data.city || "",
                    Street: data.street || data.Street || "",
                    PostalCode: data.postalCode || data.PostalCode || "",
                    Latitude: (data.latitude ?? data.Latitude)?.toString() || "",
                    Longitude: (data.longitude ?? data.Longitude)?.toString() || "",
                    DeliveryFee: (data.deliveryFee ?? data.DeliveryFee)?.toString() || "0",
                    LicenseNumber: data.LicenseNumber || "",
                });

                if (data.latitude && data.longitude) {
                    setMapPosition({
                        lat: parseFloat(data.latitude.toString()),
                        lng: parseFloat(data.longitude.toString())
                    });
                }

                if (data.imagePath) {
                    setSelectedImage(data.imagePath);
                }
            } catch (error) {
                console.error("Failed to fetch pharmacy data:", error);
                toast.error("Failed to load pharmacy information");
            } finally {
                setIsFetching(false);
            }
        };

        fetchPharmacyData();
    }, []);

    // Auto-detect location on mount if not already set
    useEffect(() => {
        if ("geolocation" in navigator && !formData.Latitude && !formData.Longitude && !isFetching) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        Latitude: latitude.toString(),
                        Longitude: longitude.toString()
                    }));
                    setMapPosition({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                }
            );
        }
    }, [isFetching, formData.Latitude, formData.Longitude]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleMapLocationSelect = (lat: number, lng: number) => {
        setMapPosition({ lat, lng });
        setFormData(prev => ({
            ...prev,
            Latitude: lat.toString(),
            Longitude: lng.toString()
        }));
    };

    const handleOpenMap = () => {
        if (formData.Latitude && formData.Longitude) {
            const lat = parseFloat(formData.Latitude);
            const lng = parseFloat(formData.Longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapPosition({ lat, lng });
            }
        }
        setIsMapOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const data = new FormData();

            data.append("name", formData.name);
            data.append("city", formData.city);
            data.append("phone", formData.phone);
            data.append("country", formData.country);
            data.append("street", formData.Street);
            data.append("postalCode", formData.PostalCode);
            data.append("latitude", formData.Latitude.toString());
            data.append("longitude", formData.Longitude.toString());
            data.append("deliveryFee", formData.DeliveryFee.toString());
            data.append("LicenseNumber", formData.LicenseNumber);

            if (imageFile) {
                data.append("image", imageFile);
            }

            await pharmacistService.updatePharmacyProfile(data);
            toast.success("Pharmacy information updated successfully!");
        } catch (error: unknown) {
            console.error("Failed to update pharmacy profile:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update pharmacy information");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-8">
                Pharmacy information
            </h2>
            <div className="bg-white rounded-2xl p-8 max-w-2xl shadow-sm">
                {/* Pharmacy Picture Upload */}
                <div className="flex flex-col items-center mb-10">
                    <p className="mb-4 text-sm text-gray-400 self-start">Upload your Pharmacy picture</p>
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <Avatar className="h-28 w-28 bg-gray-50 border-2 border-dashed border-primary">
                            <AvatarImage src={selectedImage || ""} />
                            <AvatarFallback className="bg-gray-50 flex flex-col items-center justify-center text-primary">
                                <Camera className="h-8 w-8 mb-1" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute top-0 right-0 text-primary bg-white rounded-full p-1 shadow-sm border border-gray-100">
                            <div className="relative">
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <Camera size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="name"
                                placeholder="Pharmacy Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                        <Input
                            name="LicenseNumber"
                            placeholder="License Number"
                            value={formData.LicenseNumber}
                            onChange={handleChange}
                            className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="Street"
                                placeholder="Street"
                                value={formData.Street}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="PostalCode"
                                placeholder="Postal Code"
                                value={formData.PostalCode}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="DeliveryFee"
                                type="number"
                                placeholder="Delivery fees"
                                value={formData.DeliveryFee}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center">
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="Latitude"
                                type="number"
                                placeholder="Latitude"
                                value={formData.Latitude}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="Longitude"
                                type="number"
                                placeholder="Longitude"
                                value={formData.Longitude}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleOpenMap}
                            className="h-12 w-12 rounded-xl border border-primary text-primary hover:bg-teal-50"
                            type="button"
                        >
                            <LinkIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white rounded-2xl py-6 px-10 text-lg hover:opacity-90 transition-opacity disabled:opacity-70">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>

            {/* Map Dialog */}
            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <MapIcon className="h-5 w-5" />
                            Select Pharmacy Location
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <LocationMap
                            position={mapPosition}
                            onPositionChange={handleMapLocationSelect}
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Click on the map to set your pharmacy location.
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsMapOpen(false)}>Cancel</Button>
                            <Button className="bg-primary hover:opacity-90 text-white" onClick={() => setIsMapOpen(false)}>Confirm Location</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
