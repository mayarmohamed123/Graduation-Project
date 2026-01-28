"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/Services/admin/adminService";
import toast from "react-hot-toast";

export default function PersonalInformation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsInitialLoading(true);
        const profile = await adminService.getAdminProfile();
        
        setFormData({
          userName: profile.userName || "",
          email: profile.email || "",
          phoneNumber: profile.phoneNumber || "",
          address: profile.address || "",
        });
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = new FormData();

      if (formData.userName) data.append("userName", formData.userName);
      if (formData.email) data.append("Email", formData.email);
      if (formData.phoneNumber) data.append("PhoneNumber", formData.phoneNumber);
      if (formData.address) data.append("Address", formData.address);
      
      await adminService.updateAdminProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Failed to update admin profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-8">
        Personal information
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        <div className="space-y-4">
          {/* User Name */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                name="userName"
                placeholder="User Name"
                value={formData.userName}
                onChange={handleChange}
                className="pl-9 rounded-3xl border-2 border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-11"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
               <Input
                 name="email"
                 type="email"
                 placeholder="Email"
                 value={formData.email}
                 onChange={handleChange}
                 className="pl-9 rounded-3xl border-2 border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-11"
               />
             </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="pl-9 rounded-3xl border-2 border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-11"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="pl-9 rounded-3xl border-2 border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-11"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary text-white rounded-3xl py-6 text-lg hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-70">
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
