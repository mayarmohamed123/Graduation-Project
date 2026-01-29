import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Medicine } from "@/types/medicine";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  medicine?: Medicine;
}

export const ImageUploadSection = ({ imagePreview, onImageChange, medicine }: ImageUploadSectionProps) => {
  return (
    <CardContent className="p-8 pt-0 space-y-4">
      <Label>Product Image</Label>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-2xl bg-teal-50 border-2 border-dashed border-teal-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-teal-400 relative">
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            ) : medicine?.imagePath ? (
              <Image src={medicine.imagePath} alt={medicine.brandName} fill className="object-cover" />
            ) : (
              <Upload className="w-8 h-8 text-teal-300" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <Input 
            id="image" 
            name="image" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            required={!medicine} // Required only if adding new
            onChange={onImageChange}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById('image')?.click()}
            className="rounded-xl border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700 font-medium"
          >
            {medicine ? "Change Image" : "Select Image"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Recommended size: 800x800px. Max file size: 2MB.</p>
        </div>
      </div>
    </CardContent>
  );
};
