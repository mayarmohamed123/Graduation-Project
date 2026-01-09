"use client";

import { useState, useRef } from "react";
import { AdminPharmacyDetails } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { updatePharmacy } from "@/Services/admin/pharmacies";
import { toast } from "react-hot-toast";
import { Loader2, Camera, UploadCloud } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/Components/common/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 border rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface EditPharmacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pharmacy: AdminPharmacyDetails;
  userId: string;
  onSuccess: () => void;
}

export function EditPharmacyDialog({
  open,
  onOpenChange,
  pharmacy,
  userId,
  onSuccess,
}: EditPharmacyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: pharmacy.name || "",
    phone: pharmacy.phone || "",
    deliveryFee: pharmacy.deliveryFee?.toString() || "0",
    city: pharmacy.city || "",
    street: pharmacy.street || "",
    postalCode: pharmacy.postalCode || "",
    country: pharmacy.country || "",
    latitude: pharmacy.latitude || 0,
    longitude: pharmacy.longitude || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    pharmacy.imagePath || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("deliveryFee", formData.deliveryFee);
      data.append("city", formData.city);
      data.append("street", formData.street);
      data.append("postalCode", formData.postalCode);
      data.append("country", formData.country);
      data.append("latitude", formData.latitude.toString());
      data.append("longitude", formData.longitude.toString());
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await updatePharmacy(userId, data);
      toast.success(response.message || "Pharmacy updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update pharmacy");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pharmacy Details</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
             <div 
                className="relative group cursor-pointer w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => fileInputRef.current?.click()}
             >
                {previewImage ? (
                  <Image src={previewImage} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                      <UploadCloud className="h-10 w-10" />
                      <span className="text-sm">Click to upload banner</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                </div>
             </div>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pharmacy Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
              <Input
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                min="0"
                step="0.01"
                value={formData.deliveryFee}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input value={formData.latitude} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input value={formData.longitude} readOnly className="bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <p className="text-sm text-muted-foreground mb-2">Click on the map or search to set the pharmacy location.</p>
            <LocationMap 
                position={{ lat: formData.latitude, lng: formData.longitude }} 
                onPositionChange={handleLocationChange} 
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2BBBC5] hover:bg-[#25a0a9]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
