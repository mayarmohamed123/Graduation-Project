"use client";

import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import ConfirmDialog from "@/Components/features/cart/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Plus, FileText, ChevronLeft } from "lucide-react";
import { usePrescriptionManager } from "@/hooks/usePrescriptionManager";
import { PrescriptionFormFields } from "@/Components/features/doctor/prescriptions/PrescriptionFormFields";
import { PrescriptionCard } from "@/Components/features/doctor/prescriptions/PrescriptionCard";

export default function PatientPrescriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    prescriptions,
    loading,
    newItem,
    setNewItem,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isAddItemDialogOpen,
    setIsAddItemDialogOpen,
    isEditItemDialogOpen,
    setIsEditItemDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeleteItemDialogOpen,
    setIsDeleteItemDialogOpen,
    isDeleting,
    isSavingItem,
    handlers,
    dialogs,
  } = usePrescriptionManager(patientId);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
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

        <Button
          onClick={() => {
            handlers.resetForm();
            setIsCreateDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> New Prescription
        </Button>
      </div>

      {/* Content */}
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
            <PrescriptionCard
              key={px.id}
              prescription={px}
              onAddItem={dialogs.openAddItemDialog}
              onDeletePrescription={dialogs.openDeletePrescriptionDialog}
              onEditItem={dialogs.openEditItemDialog}
              onDeleteItem={dialogs.openDeleteItemDialog}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      
      {/* Create Prescription Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Prescription</DialogTitle>
          </DialogHeader>
          <PrescriptionFormFields data={newItem} onChange={setNewItem} />
          <DialogFooter>
            <Button onClick={handlers.handleCreatePrescription} disabled={isSavingItem}>
              {isSavingItem ? "Creating..." : "Create Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Item to Prescription</DialogTitle>
          </DialogHeader>
          <PrescriptionFormFields data={newItem} onChange={setNewItem} />
          <DialogFooter>
            <Button onClick={handlers.handleAddItem} disabled={isSavingItem}>
              {isSavingItem ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Prescription Item</DialogTitle>
          </DialogHeader>
          <PrescriptionFormFields data={newItem} onChange={setNewItem} />
          <DialogFooter>
            <Button onClick={handlers.handleUpdateItem} disabled={isSavingItem}>
              {isSavingItem ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Prescription Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handlers.handleDeletePrescription}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Delete Item Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteItemDialogOpen}
        onClose={() => setIsDeleteItemDialogOpen(false)}
        onConfirm={handlers.handleDeleteItem}
        title="Delete Item"
        message="Are you sure you want to delete this medication item?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
