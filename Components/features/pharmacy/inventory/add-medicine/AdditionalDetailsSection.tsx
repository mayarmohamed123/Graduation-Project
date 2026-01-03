import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Medicine } from "@/types/medicine";

interface AdditionalDetailsSectionProps {
  medicine?: Medicine;
}

export const AdditionalDetailsSection = ({ medicine }: AdditionalDetailsSectionProps) => {
  return (
    <>
      <CardHeader className="bg-gradient-to-r from-teal-50/50 to-transparent border-b border-gray-50 pb-8">
        <CardTitle className="text-xl font-bold font-outfit text-gray-800">Additional Details</CardTitle>
        <CardDescription>Enter more detailed information about usage and warnings.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={medicine?.description} placeholder="Describe the medicine..." required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500 min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="composition">Composition</Label>
          <Textarea id="composition" name="composition" defaultValue={medicine?.composition} placeholder="Enter ingredients..." required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500 min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="directionsForUse">Directions for Use</Label>
          <Textarea id="directionsForUse" name="directionsForUse" defaultValue={medicine?.directionsForUse} placeholder="How to use..." required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500 min-h-[100px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="suitableFor">Suitable For</Label>
            <Input id="suitableFor" name="suitableFor" defaultValue={medicine?.suitableFor} placeholder="e.g., Adults, Children" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notSuitableFor">Not Suitable For</Label>
            <Input id="notSuitableFor" name="notSuitableFor" defaultValue={medicine?.notSuitableFor} placeholder="e.g., Pregnant women" required className="rounded-xl border-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="warning" className="text-red-500">Warnings</Label>
          <Textarea id="warning" name="warning" defaultValue={medicine?.warning} placeholder="Safety warnings..." required className="rounded-xl border-red-100 focus:ring-red-500 focus:border-red-500 min-h-[80px]" />
        </div>
      </CardContent>
    </>
  );
};
