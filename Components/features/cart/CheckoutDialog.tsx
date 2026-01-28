"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

export interface CheckoutFormData {
  country: string;
  city: string;
  street: string;
  phoneNumber: string;
}

export default function CheckoutDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CheckoutDialogProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    country: "Egypt",
    city: "Cairo",
    street: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shipping Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-primary font-medium">
              Country
            </Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              className="rounded-xl border-gray-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-primary font-medium">
              City
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="rounded-xl border-gray-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street" className="text-primary font-medium">
              Street Address
            </Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter your street address"
              className="rounded-xl border-gray-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-primary font-medium">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="rounded-xl border-gray-200"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
