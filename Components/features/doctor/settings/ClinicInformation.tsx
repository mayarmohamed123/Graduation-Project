"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Building, Phone, MapPin, DollarSign, Link as LinkIcon, Loader2, Map as MapIcon, Camera as CameraIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { doctorService } from "@/Services/doctorService";
import toast from "react-hot-toast";

const LocationMap = dynamic(() => import("@/Components/common/LocationMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading Map...</div>
});

export default function ClinicInformation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Map state
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    clinicName: "",
    phone: "",
    country: "",
    city: "",
    postalCode: "",
    street: "",
    longitude: "",
    latitude: "",
    consultationType: "",
    price: "",
  });

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        setIsInitialLoading(true);
        const clinic = await doctorService.getClinicOfDoctor();
        
        if (clinic) {
          setFormData({
            clinicName: clinic.name || "",
            phone: clinic.phone || "",
            country: clinic.country || "",
            city: clinic.city || "",
            postalCode: clinic.postalCode || "",
            street: clinic.street || "",
            longitude: clinic.longitude?.toString() || "",
            latitude: clinic.latitude?.toString() || "",
            consultationType: "", 
            price: "", 
          });

          if (clinic.imagePath) {
            setSelectedImage(clinic.imagePath);
          }

          if (clinic.latitude && clinic.longitude) {
            setMapPosition({ lat: clinic.latitude, lng: clinic.longitude });
          }
        }
      } catch (error) {
        console.error("Failed to fetch clinic data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchClinic();
  }, []);

  // Auto-detect location on mount if not provided by clinic
  useEffect(() => {
    if ("geolocation" in navigator && !formData.latitude && !formData.longitude && !isInitialLoading) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          setMapPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoading]);

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

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setMapPosition({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
  };

  const handleOpenMap = () => {
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
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

      if (formData.clinicName) data.append("Name", formData.clinicName);
      if (formData.phone) data.append("Phone", formData.phone);
      if (formData.country) data.append("country", formData.country);
      if (formData.city) data.append("city", formData.city);
      if (formData.street) data.append("street", formData.street);
      if (formData.postalCode) data.append("postalCode", formData.postalCode);
      if (formData.longitude) data.append("Longitude", formData.longitude);
      if (formData.latitude) data.append("Latitude", formData.latitude);
      if (formData.consultationType) data.append("ConsultationType", formData.consultationType);
      if (formData.price) data.append("ConsultationPrice", formData.price);

      if (imageFile) {
        data.append("ClinicImage", imageFile);
      }

      await doctorService.updateClinicData(data);
      toast.success("Clinic details updated successfully!");
    } catch (error: unknown) {
      console.error("Failed to update clinic info:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update clinic details");
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
        Clinic information
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        {/* Clinic Image Upload */}
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

          <div className="flex gap-4">
            <div className="relative w-32 shrink-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                <Image
                  src="https://flagcdn.com/w20/eg.png"
                  alt="Egypt"
                  width={20}
                  height={15}
                  className="w-5 h-auto rounded-sm"
                />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

          {/* Address - Country, City, Street, Postal Code */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
                <Input
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
              <div className="relative">
                <Input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                  className="rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
              <div className="relative">
                <Input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
                />
              </div>
            </div>
          </div>

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
            <Button
              variant="outline"
              size="icon"
              onClick={handleOpenMap}
              className="h-11 w-11 rounded-xl border-2 border-[#2BBBC5] text-[#2BBBC5] hover:text-[#2BBBC5] hover:bg-teal-50"
              type="button"
            >
              <LinkIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Consultation Type and Price */}
          <div className="grid grid-cols-2 gap-4">
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
                <option value="home-visit" className="text-gray-900">Home Visit</option>
                <option value="in-clinic" className="text-gray-900">In Clinic</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2BBBC5]">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2BBBC5]" />
              <Input
                name="price"
                type="number"
                placeholder="Consultation Price"
                value={formData.price}
                onChange={handleChange}
                className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] h-11"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-12 bg-[#2BBBC5] text-white rounded-3xl py-6 text-lg hover:bg-[#249da5] shadow-md shadow-[#2BBBC5]/20 disabled:opacity-70">
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
            <DialogTitle className="flex items-center gap-2 text-[#2BBBC5]">
              <MapIcon className="h-5 w-5" />
              Select Clinic Location
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <LocationMap
              position={mapPosition}
              onPositionChange={handleMapLocationSelect}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Click on the map to set your clinic location.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsMapOpen(false)}>Cancel</Button>
              <Button className="bg-[#2BBBC5] hover:bg-[#249da5] text-white" onClick={() => setIsMapOpen(false)}>Confirm Location</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
      <path d="M12 9v.01" />
    </svg>
  )
}
