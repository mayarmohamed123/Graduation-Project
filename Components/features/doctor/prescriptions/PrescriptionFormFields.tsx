import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { AddPrescriptionItemInput } from "@/types/prescription";

interface PrescriptionFormFieldsProps {
  data: AddPrescriptionItemInput;
  onChange: (data: AddPrescriptionItemInput) => void;
}

export function PrescriptionFormFields({ data, onChange }: PrescriptionFormFieldsProps) {
  const handleChange = (field: keyof AddPrescriptionItemInput, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Medication Name</Label>
          <Input
            value={data.medicationName}
            onChange={(e) => handleChange("medicationName", e.target.value)}
            placeholder="e.g. Augmentin"
          />
        </div>
        <div className="space-y-2">
          <Label>Strength</Label>
          <Input
            value={data.medicationStrength}
            onChange={(e) => handleChange("medicationStrength", e.target.value)}
            placeholder="e.g. 625mg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Dosage</Label>
          <Input
            value={data.dosage}
            onChange={(e) => handleChange("dosage", e.target.value)}
            placeholder="e.g. 1 tablet"
          />
        </div>
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={data.quantity}
            onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Duration</Label>
        <Input
          value={data.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          placeholder="e.g. 7 days"
        />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={data.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="e.g. After meals"
        />
      </div>
    </div>
  );
}
