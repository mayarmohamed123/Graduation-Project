"use client";

import { useEffect, useState, use, useCallback } from "react";
import { 
    getPharmacistById, 
    getPharmacyMedicines,
    deleteMedicineAdmin 
} from "@/Services/admin/pharmacies";
import { AdminPharmacist, AdminMedicine } from "@/types/admin";
import { MedicineTable } from "@/Components/features/pharmacy/inventory/MedicineTable";
import { Activity, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/Components/common/ConfirmDialog";
import { Medicine } from "@/types/medicine";

export default function AdminPharmacyInventoryPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const router = useRouter();
    const [pharmacist, setPharmacist] = useState<AdminPharmacist | null>(null);
    const [medicines, setMedicines] = useState<AdminMedicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState<AdminMedicine | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const pharmacistData = await getPharmacistById(userId);
            setPharmacist(pharmacistData);

            if (pharmacistData) {
                const medicinesData = await getPharmacyMedicines(pharmacistData.pharmacyId);
                setMedicines(medicinesData);
            }
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = (medicine: AdminMedicine) => {
        setMedicineToDelete(medicine);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!medicineToDelete || !pharmacist) return;

        try {
            setIsDeleting(true);
            const response = await deleteMedicineAdmin(medicineToDelete.id, pharmacist.pharmacyId);
            toast.success(response.message || "Medicine deleted successfully.");
            setMedicines(prev => prev.filter(m => m.id !== medicineToDelete.id));
            setDeleteDialogOpen(false);
            setMedicineToDelete(null);
        } catch (error) {
            console.error("Failed to delete medicine:", error);
            toast.error("Failed to delete medicine.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredMedicines = medicines.filter((m) => 
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-outfit text-gray-900">
                        {pharmacist?.pharmacyName} Inventory
                    </h1>
                    <p className="text-sm text-muted-foreground">Manage medicine products for this pharmacy</p>
                </div>
            </div>

            <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold font-outfit text-gray-800">Products</h2>
                    <Button 
                        onClick={() => router.push(`/admin/pharmacies/${userId}/add-medicine`)}
                        className="bg-[#2BBBC5] hover:bg-[#25a0a9] rounded-xl px-6"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
                
                <MedicineTable 
                    medicines={filteredMedicines as unknown as Medicine[]}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onEdit={(medicine) => router.push(`/admin/pharmacies/${userId}/add-medicine?id=${medicine.id}`)}
                    onDelete={(medicine) => handleDelete(medicine as unknown as AdminMedicine)}
                />
            </div>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Medicine"
                description={`Are you sure you want to delete ${medicineToDelete?.brandName}? This action cannot be undone.`}
                confirmText="Delete Product"
                cancelText="Keep Product"
                isLoading={isDeleting}
                variant="destructive"
            />
        </div>
    );
}
