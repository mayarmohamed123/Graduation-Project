import { Package } from "lucide-react";
import Image from "next/image";
import { AdminMedicine } from "@/types/admin";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MedicineInventoryTableProps {
    medicines: AdminMedicine[];
}

export function MedicineInventoryTable({ medicines }: MedicineInventoryTableProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-primary" />
                    Medicine Inventory
                </CardTitle>
                <Badge variant="secondary">{medicines.length} Products</Badge>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Medicine Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicines.length > 0 ? (
                                medicines.map((medicine) => (
                                    <TableRow key={medicine.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className="relative h-10 w-10 rounded border overflow-hidden bg-white">
                                                <Image src={medicine.imagePath} alt={medicine.brandName} fill className="object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{medicine.brandName}</span>
                                                <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{medicine.genericName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] capitalize">
                                                {medicine.medicationCategory}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-sm">
                                            ${medicine.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm ${medicine.quantity < 10 ? "text-red-500 font-bold" : "text-gray-600"}`}>
                                                {medicine.quantity}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className={medicine.quantity > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                                                {medicine.quantity > 0 ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No medicines found in this pharmacy.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
