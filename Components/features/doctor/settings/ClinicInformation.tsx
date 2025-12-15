"use client";

import { useState } from "react";
import { Building, Phone, MapPin, DollarSign, Link as LinkIcon, Globe } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ClinicInformation() {
  const [formData, setFormData] = useState({
    clinicName: "",
    phone: "",
    address: "",
    longitude: "",
    latitude: "",
    consultationType: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-8">
        Clinic information
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        {/* Clinic Image Upload */}
         <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer">
            <Avatar className="h-28 w-28 bg-gray-50 border-2 border-dashed border-[#2BBBC5]">
               <AvatarImage src="" />
               <AvatarFallback className="bg-gray-50 flex flex-col items-center justify-center text-[#2BBBC5]">
                  <div className="border border-[#2BBBC5] rounded p-1">
                      <CameraIcon className="h-5 w-5" />
                  </div>
               </AvatarFallback>
            </Avatar>
             <div className="absolute top-0 right-0 text-[#2BBBC5] bg-white rounded-full p-1 shadow-sm border border-gray-100">
               <div className="relative">
                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2BBBC5]"></span>
                   </span>
                   <CameraIcon size={12} />
               </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400">Upload your clinic/hospital image</p>
        </div>

        <div className="space-y-4">
          {/* Clinic Name */}
          <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="clinicName"
                  placeholder="Clinic Name"
                  value={formData.clinicName}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4">
             <div className="relative w-32 shrink-0">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <img src="https://flagcdn.com/w20/eg.png" alt="Egypt" className="w-5 h-auto rounded-sm" />
                 </div>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                 <div className="flex w-full h-11 items-center justify-center pl-8 rounded-3xl border-2 border-[#2BBBC5] text-gray-700 text-sm">
                    +20
                 </div>
             </div>

              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="phone"
                  placeholder="Clinic Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="address"
                  placeholder="Country, City, Street"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
          </div>

          {/* Location Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center">
            <div className="relative">
                <Input
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="text-[#2BBBC5] placeholder:text-[#2BBBC5] border-2 border-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] rounded-3xl h-11 px-6"
                />
            </div>
            <div className="relative">
                 <Input
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="text-[#2BBBC5] placeholder:text-[#2BBBC5] border-2 border-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] rounded-3xl h-11 px-6"
                />
            </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 border-[#2BBBC5] text-[#2BBBC5] hover:text-[#2BBBC5] hover:bg-teal-50">
                <LinkIcon className="h-5 w-5" />
             </Button>
          </div>

          {/* Type and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <div className="relative">
                <select
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 text-sm h-11 rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] focus:outline-none focus:border-[#2BBBC5] appearance-none bg-white",
                    !formData.consultationType && "text-[#2BBBC5]"
                  )}
                >
                  <option value="" disabled>Consultation type</option>
                  <option value="online" className="text-gray-900">Online</option>
                  <option value="physical" className="text-gray-900">Physical</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2BBBC5]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            className="w-full sm:w-auto px-12 bg-[#2BBBC5] text-white rounded-3xl py-6 text-lg hover:bg-[#249da5] shadow-md shadow-[#2BBBC5]/20">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Icon helper
function CameraIcon({ className, size }: { className?: string; size?: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
            <path d="M12 9v.01" />
        </svg>
    )
}
