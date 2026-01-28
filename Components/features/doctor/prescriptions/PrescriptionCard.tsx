import { Calendar, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Prescription, PrescriptionItem } from "@/types/prescription";
import { PrescriptionItemTable } from "./PrescriptionItemTable";

interface PrescriptionCardProps {
  prescription: Prescription;
  onAddItem: (id: number) => void;
  onDeletePrescription: (id: number) => void;
  onEditItem: (item: PrescriptionItem) => void;
  onDeleteItem: (itemId: number) => void;
}

export function PrescriptionCard({
  prescription,
  onAddItem,
  onDeletePrescription,
  onEditItem,
  onDeleteItem,
}: PrescriptionCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
      <CardHeader className="bg-gray-50/50 flex flex-row items-center justify-between space-y-0 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">
              Created at {new Date(prescription.issuedAt).toLocaleDateString()}
            </CardTitle>
            <CardDescription>Prescription</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onAddItem(prescription.id)}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDeletePrescription(prescription.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <PrescriptionItemTable
            items={prescription.items}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
        />
      </CardContent>
    </Card>
  );
}
