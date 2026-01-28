import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Medicine } from "@/types/medicine";

interface BasicInfoSectionProps {
  medicine?: Medicine;
}

export const BasicInfoSection = ({ medicine }: BasicInfoSectionProps) => {
  return (
    <>
      <CardHeader className="bg-gradient-to-r from-teal-50/50 to-transparent border-b border-gray-50 pb-8">
        <CardTitle className="text-xl font-bold font-outfit text-gray-800">Basic Information</CardTitle>
        <CardDescription>Enter the essential details of the medicine.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="BrandName">Brand Name</Label>
            <Input id="BrandName" name="BrandName" defaultValue={medicine?.brandName} placeholder="e.g., Panadol" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="GenericName">Generic Name</Label>
            <Input id="GenericName" name="GenericName" defaultValue={medicine?.genericName} placeholder="e.g., Paracetamol" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="DosageForm">Dosage Form</Label>
            <Input id="DosageForm" name="DosageForm" defaultValue={medicine?.dosageFormType} placeholder="e.g., Tablet, Syrup" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Strength">Strength</Label>
            <Input id="Strength" name="Strength" defaultValue={medicine?.strength} placeholder="e.g., 500mg" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ATCCode">ATC Code</Label>
            <Input id="ATCCode" name="ATCCode" defaultValue={medicine?.atcCode} placeholder="e.g., N02BE01" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Price">Price ($)</Label>
              <Input id="Price" name="Price" type="number" step="0.01" defaultValue={medicine?.price} placeholder="0.00" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Quantity">Quantity</Label>
              <Input id="Quantity" name="Quantity" type="number" defaultValue={medicine?.quantity} placeholder="0" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};
