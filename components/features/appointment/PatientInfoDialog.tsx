"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Form state type (allows empty values)
interface PatientInfoForm {
  PatientName: string;
  PatientPhone: string;
  patientAge: number | "";
  patientGender: "male" | "female" | "";
}

// Submitted data type (all values filled)
export interface SubmittedPatientInfo {
  PatientName: string;
  PatientPhone: string;
  patientAge: number;
  patientGender: string;
}

interface PatientInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (patientInfo: SubmittedPatientInfo) => void;
  isLoading?: boolean;
}

export default function PatientInfoDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: PatientInfoDialogProps) {
  const [formData, setFormData] = useState<PatientInfoForm>({
    PatientName: "",
    PatientPhone: "",
    patientAge: "",
    patientGender: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PatientInfoForm, string>>>({});

  const handleChange = (field: keyof PatientInfoForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PatientInfoForm, string>> = {};

    if (!formData.PatientName.trim()) {
      newErrors.PatientName = "Name is required";
    }

    if (!formData.PatientPhone.trim()) {
      newErrors.PatientPhone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.PatientPhone.replace(/\s/g, ""))) {
      newErrors.PatientPhone = "Please enter a valid phone number";
    }

    if (!formData.patientAge) {
      newErrors.patientAge = "Age is required";
    } else if (Number(formData.patientAge) < 1 || Number(formData.patientAge) > 120) {
      newErrors.patientAge = "Please enter a valid age";
    }

    if (!formData.patientGender) {
      newErrors.patientGender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        PatientName: formData.PatientName,
        PatientPhone: formData.PatientPhone,
        patientAge: Number(formData.patientAge),
        patientGender: formData.patientGender as string,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Patient Information
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter patient name"
              value={formData.PatientName}
              onChange={(e) => handleChange("PatientName", e.target.value)}
              className={cn(
                "rounded-lg",
                errors.PatientName && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.PatientName && (
              <p className="text-xs text-red-500">{errors.PatientName}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.PatientPhone}
              onChange={(e) => handleChange("PatientPhone", e.target.value)}
              className={cn(
                "rounded-lg",
                errors.PatientPhone && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.PatientPhone && (
              <p className="text-xs text-red-500">{errors.PatientPhone}</p>
            )}
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder="Age"
                value={formData.patientAge}
                onChange={(e) => handleChange("patientAge", e.target.value)}
                className={cn(
                  "rounded-lg",
                  errors.patientAge && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.patientAge && (
                <p className="text-xs text-red-500">{errors.patientAge}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  id="gender"
                  value={formData.patientGender}
                  onChange={(e) => handleChange("patientGender", e.target.value)}
                  className={cn(
                    "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none",
                    errors.patientGender && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                    !formData.patientGender && "text-gray-400"
                  )}
                >
                  <option value="" disabled>Select</option>
                  <option value="male" className="text-gray-900">Male</option>
                  <option value="female" className="text-gray-900">Female</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {errors.patientGender && (
                <p className="text-xs text-red-500">{errors.patientGender}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-full px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-primary hover:bg-primary/90 rounded-full px-6"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
