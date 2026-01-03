"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, User, Mail, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { authService } from "@/Services/authService";
import { pharmacistService } from "@/Services/pharmacistService";
import { userService } from "@/Services/userService";
import toast from "react-hot-toast";

export default function PharmacistInformation() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsFetching(true);
                const data = await authService.getProfile();

                // Split UserName into First and Last names
                const names = (data.userName || "").split(" ");
                setFormData({
                    firstName: names[0] || "",
                    lastName: names.slice(1).join(" ") || "",
                    email: data.email || "",
                });

                if (data.profileImage) {
                    setSelectedImage(data.profileImage);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsFetching(false);
            }
        };

        fetchProfile();
    }, []);

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

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // 1. Upload Profile Picture if changed
            if (imageFile) {
                await userService.uploadProfilePicture(imageFile);
            }

            // 2. Update Profile Name & Email
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            await pharmacistService.updatePharmacistProfile({
                UserName: fullName,
                email: formData.email
            });

            toast.success("Profile updated successfully!");
        } catch (error: unknown) {
            console.error("Failed to update profile:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
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
                Pharmacist information
            </h2>
            <div className="bg-white rounded-2xl p-8 max-w-2xl shadow-sm">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-10">
                    <p className="mb-4 text-sm text-gray-400 self-start">Upload your profile picture</p>
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
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                        <Input
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-11 rounded-3xl border border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-12"
                        />
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
        </div>
    );
}
