import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { prescriptionService } from "@/Services/prescriptionService";
import {
  Prescription,
  AddPrescriptionItemInput,
  CreatePrescriptionInput,
  PrescriptionItem,
} from "@/types/prescription";

const initialFormState: AddPrescriptionItemInput = {
  medicationName: "",
  medicationStrength: "",
  dosage: "",
  quantity: 1,
  duration: "",
  notes: "",
};

export const usePrescriptionManager = (patientId: string) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog visibility states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false);
  
  // Selected IDs for actions
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // Loading states for actions
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Form state
  const [newItem, setNewItem] = useState<AddPrescriptionItemInput>(initialFormState);

  const resetForm = useCallback(() => {
    setNewItem(initialFormState);
  }, []);

  const fetchPrescriptions = useCallback(async () => {
    if (!patientId) return;
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
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleCreatePrescription = async () => {
    try {
      setIsSavingItem(true);
      const input: CreatePrescriptionInput = {
        userId: patientId,
        doctorId: 7, // Hardcoded for now
        items: [newItem],
      };

      await prescriptionService.createPrescription(input);
      toast.success("Prescription created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPrescriptions();
    } catch {
      toast.error("Failed to create prescription");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleAddItem = async () => {
    if (selectedPrescriptionId === null) return;
    try {
      setIsSavingItem(true);
      await prescriptionService.addItemToPrescription(selectedPrescriptionId, newItem);
      toast.success("Item added successfully");
      setIsAddItemDialogOpen(false);
      resetForm();
      fetchPrescriptions();
    } catch {
      toast.error("Failed to add item");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleUpdateItem = async () => {
    if (selectedItemId === null) return;
    try {
      setIsSavingItem(true);
      await prescriptionService.updatePrescriptionItem(selectedItemId, newItem);
      toast.success("Item updated successfully");
      setIsEditItemDialogOpen(false);
      resetForm();
      fetchPrescriptions();
    } catch {
      toast.error("Failed to update item");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteItem = async () => {
    if (selectedItemId === null) return;
    try {
      setIsDeleting(true);
      await prescriptionService.deletePrescriptionItem(selectedItemId);
      toast.success("Item deleted successfully");
      setIsDeleteItemDialogOpen(false);
      setSelectedItemId(null);
      fetchPrescriptions();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePrescription = async () => {
    if (selectedPrescriptionId === null) return;
    try {
      setIsDeleting(true);
      await prescriptionService.deletePrescription(selectedPrescriptionId);
      toast.success("Prescription deleted successfully");
      setIsDeleteDialogOpen(false);
      setPrescriptions((prev) => prev.filter((px) => px.id !== selectedPrescriptionId));
      setSelectedPrescriptionId(null);
    } catch {
      toast.error("Failed to delete prescription");
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddItemDialog = (prescriptionId: number) => {
    setSelectedPrescriptionId(prescriptionId);
    resetForm();
    setIsAddItemDialogOpen(true);
  };

  const openEditItemDialog = (item: PrescriptionItem) => {
    setSelectedItemId(item.id);
    setNewItem({
      medicationName: item.medicationName,
      medicationStrength: item.medicationStrength,
      dosage: item.dosage,
      quantity: item.quantity,
      duration: item.duration,
      notes: item.notes,
    });
    setIsEditItemDialogOpen(true);
  };

  const openDeletePrescriptionDialog = (prescriptionId: number) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsDeleteDialogOpen(true);
  };

  const openDeleteItemDialog = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsDeleteItemDialogOpen(true);
  };

  return {
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
    handlers: {
      handleCreatePrescription,
      handleAddItem,
      handleUpdateItem,
      handleDeleteItem,
      handleDeletePrescription,
      resetForm,
    },
    dialogs: {
      openAddItemDialog,
      openEditItemDialog,
      openDeletePrescriptionDialog,
      openDeleteItemDialog,
    }
  };
};
