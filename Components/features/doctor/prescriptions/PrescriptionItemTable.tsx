import { Pill, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { PrescriptionItem } from "@/types/prescription";

interface PrescriptionItemTableProps {
  items: PrescriptionItem[];
  onEdit: (item: PrescriptionItem) => void;
  onDelete: (itemId: number) => void;
}

export function PrescriptionItemTable({ items, onEdit, onDelete }: PrescriptionItemTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/30 border-b">
          <tr>
            <th className="px-6 py-3 font-medium">Medication</th>
            <th className="px-6 py-3 font-medium">Strength</th>
            <th className="px-6 py-3 font-medium">Dosage</th>
            <th className="px-6 py-3 font-medium">Qty</th>
            <th className="px-6 py-3 font-medium">Duration</th>
            <th className="px-6 py-3 font-medium">Notes</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary/60" />
                  <span className="font-medium text-gray-900">{item.medicationName}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">{item.medicationStrength}</td>
              <td className="px-6 py-4 text-gray-600">{item.dosage}</td>
              <td className="px-6 py-4 text-gray-600 font-mono">{item.quantity}</td>
              <td className="px-6 py-4 text-gray-600">{item.duration}</td>
              <td className="px-6 py-4 text-gray-500 italic truncate max-w-[150px]">{item.notes}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:text-teal-600 hover:bg-teal-50"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
