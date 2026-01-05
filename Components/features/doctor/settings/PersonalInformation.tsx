"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Building, User, Mail, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { cn } from "@/lib/utils";
import { doctorService } from "@/Services/doctorService";
import { authService } from "@/Services/authService";
import toast from "react-hot-toast";

export default function PersonalInformation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    gender: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsInitialLoading(true);
        const profile = await authService.getProfile();
        
        // Split userName into first and last name if possible
        const nameParts = profile.userName?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          firstName,
          lastName,
          specialty: profile.specialty || "",
          gender: profile.gender?.toLowerCase() || "",
          email: profile.email || "",
        });

        if (profile.profileImage) {
          setSelectedImage(profile.profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const data = new FormData();

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (fullName) data.append("userName", fullName);
      
      if (formData.specialty) data.append("Specialty", formData.specialty);
      if (formData.gender) data.append("Gender", formData.gender);
      if (formData.email) data.append("Email", formData.email);
      
      if (imageFile) {
        data.append("ImageFile", imageFile);
      }

      await doctorService.updateDoctorProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2BBBC5]" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-8">
        Personal information
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
            <Avatar className="h-28 w-28 bg-gray-50 border-2 border-dashed border-[#2BBBC5]">
               <AvatarImage src={selectedImage || ""} />
               <AvatarFallback className="bg-gray-50 flex flex-col items-center justify-center text-[#2BBBC5]">
                  <Camera className="h-8 w-8 mb-1" />
               </AvatarFallback>
            </Avatar>
            <div className="absolute top-0 right-0 text-[#2BBBC5] bg-white rounded-full p-1 shadow-sm border border-gray-100">
               <div className="relative">
                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2BBBC5]"></span>
                   </span>
                   <Camera size={14} />
               </div>
            </div>
            
          </div>
          <p className="mt-4 text-sm text-gray-400">Upload your profile picture</p>
        </div>

        <div className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
            </div>
          </div>

          {/* Specialty & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="specialty"
                  placeholder="Specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 text-sm h-11 rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] focus:outline-none focus:border-[#2BBBC5] appearance-none bg-white",
                    !formData.gender && "text-[#2BBBC5]"
                  )}
                >
                  <option value="" disabled>Gender</option>
                  <option value="male" className="text-gray-900">Male</option>
                  <option value="female" className="text-gray-900">Female</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#2BBBC5]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
             <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#2BBBC5] text-white rounded-3xl py-6 text-lg hover:bg-[#249da5] shadow-md shadow-[#2BBBC5]/20 disabled:opacity-70">
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
