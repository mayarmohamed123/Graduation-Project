"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { prescriptionService } from "@/Services/prescriptionService";
import {
  Prescription,
  CreatePrescriptionInput,
  AddPrescriptionItemInput,
} from "@/types/prescription";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import ConfirmDialog from "@/Components/features/cart/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  ChevronLeft,
  Pill
} from "lucide-react";

export default function PatientPrescriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [newItem, setNewItem] = useState<AddPrescriptionItemInput>({
    medicationName: "",
    medicationStrength: "",
    dosage: "",
    quantity: 0,
    duration: "",
    notes: "",
  });

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getUserPrescriptions(patientId);
      setPrescriptions(data);
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId, fetchPrescriptions]);

  const handleCreatePrescription = async () => {
    try {
      // For simplicity in this UI, we create a prescription with one initial item
      // In a real app, we might add multiple items before submitting
      const input: CreatePrescriptionInput = {
        userId: patientId,
        doctorId: 7, // Hardcoded for now as per instructions or could be from auth
        items: [newItem],
      };

      await prescriptionService.createPrescription(input);
      toast.success("Prescription created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPrescriptions();
    } catch {
      toast.error("Failed to create prescription");
    }
  };

  const handleAddItem = async () => {
    if (!selectedPrescriptionId) return;
    try {
      await prescriptionService.addItemToPrescription(selectedPrescriptionId, newItem);
      toast.success("Item added successfully");
      setIsAddItemDialogOpen(false);
      resetForm();
      fetchPrescriptions();
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDeletePrescription = async () => {
    if (!selectedPrescriptionId) return;
    try {
      setIsDeleting(true);
      await prescriptionService.deletePrescription(selectedPrescriptionId);
      toast.success("Prescription deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchPrescriptions();
    } catch {
      toast.error("Failed to delete prescription");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setNewItem({
      medicationName: "",
      medicationStrength: "",
      dosage: "",
      quantity: 1,
      duration: "",
      notes: "",
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Prescriptions</h1>
            <p className="text-gray-500">Manage medical prescriptions for this patient</p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medication Name</Label>
                  <Input 
                    value={newItem.medicationName}
                    onChange={(e) => setNewItem({...newItem, medicationName: e.target.value})}
                    placeholder="e.g. Augmentin"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Strength</Label>
                  <Input 
                    value={newItem.medicationStrength}
                    onChange={(e) => setNewItem({...newItem, medicationStrength: e.target.value})}
                    placeholder="e.g. 625mg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input 
                    value={newItem.dosage}
                    onChange={(e) => setNewItem({...newItem, dosage: e.target.value})}
                    placeholder="e.g. 1 tablet"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  value={newItem.duration}
                  onChange={(e) => setNewItem({...newItem, duration: e.target.value})}
                  placeholder="e.g. 7 days"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  value={newItem.notes}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  placeholder="e.g. After meals"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePrescription}>Create Prescription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-4">
            <div className="mx-auto bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No prescriptions found</h3>
              <p className="text-gray-500">This patient doesn&apos;t have any prescriptions yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {prescriptions.map((px) => (
            <Card key={px.id} className="overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 flex flex-row items-center justify-between space-y-0 py-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Created at {new Date(px.issuedAt).toLocaleDateString()}</CardTitle>
                    <CardDescription>Prescription</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Dialog open={isAddItemDialogOpen && selectedPrescriptionId === px.id} onOpenChange={(open) => {
                     setIsAddItemDialogOpen(open);
                     if(open) setSelectedPrescriptionId(px.id);
                   }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedPrescriptionId(px.id);
                        resetForm();
                      }}>
                        <Plus className="h-4 w-4 mr-1" /> Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add Item to Prescription</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Medication Name</Label>
                              <Input 
                                value={newItem.medicationName}
                                onChange={(e) => setNewItem({...newItem, medicationName: e.target.value})}
                                placeholder="e.g. Brufen"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Strength</Label>
                              <Input 
                                value={newItem.medicationStrength}
                                onChange={(e) => setNewItem({...newItem, medicationStrength: e.target.value})}
                                placeholder="e.g. 400mg"
                              />
                            </div>
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Dosage</Label>
                              <Input 
                                value={newItem.dosage}
                                onChange={(e) => setNewItem({...newItem, dosage: e.target.value})}
                                placeholder="e.g. 1 tablet"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input 
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input 
                              value={newItem.duration}
                              onChange={(e) => setNewItem({...newItem, duration: e.target.value})}
                              placeholder="e.g. 5 days"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea 
                              value={newItem.notes}
                              onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                              placeholder="e.g. If needed"
                            />
                          </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddItem}>Add Item</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setSelectedPrescriptionId(px.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {px.items.map((item) => (
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
                          <td className="px-6 py-4 text-gray-500 italic">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePrescription}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
