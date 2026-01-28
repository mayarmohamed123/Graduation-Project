import React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface AddMedicineFooterProps {
  isSubmitting: boolean;
}

export const AddMedicineFooter = ({ isSubmitting }: AddMedicineFooterProps) => {
  const router = useRouter();
  return (
    <CardFooter className="p-8 bg-gray-50/50 flex justify-end gap-4 border-t border-gray-50">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => router.back()}
        className="rounded-2xl px-8"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-[#2BBBC5] hover:bg-[#25a0a9] rounded-2xl px-8 shadow-lg shadow-teal-100/50 transition-all active:scale-95"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Product
          </>
        )}
      </Button>
    </CardFooter>
  );
};
