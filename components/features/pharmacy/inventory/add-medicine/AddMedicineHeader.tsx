import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddMedicineHeaderProps {
  isEditing?: boolean;
}

export const AddMedicineHeader = ({ isEditing }: AddMedicineHeaderProps) => {
  const router = useRouter();
  return (
    <div className="mb-8 flex items-center gap-4">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="rounded-full h-10 w-10 p-0 hover:bg-teal-50 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">
          {isEditing ? "Edit Medicine" : "Add New Medicine"}
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          {isEditing ? "Update existing product details." : "Add a new product to your pharmacy inventory."}
        </p>
      </div>
    </div>
  );
};
