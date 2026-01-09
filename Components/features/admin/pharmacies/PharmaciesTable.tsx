import Image from "next/image";
import { Check, X, Trash2, Eye, Building2, Phone, MapPin, Package, ClipboardList } from "lucide-react";
import { AdminPharmacist } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

interface PharmaciesTableProps {
    pharmacists: AdminPharmacist[];
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onDelete: (id: number) => void;
    onViewDetails: (pharmacist: AdminPharmacist) => void;
    onInventoryClick?: (pharmacist: AdminPharmacist) => void;
    onOrdersClick?: (pharmacist: AdminPharmacist) => void;
}

export function PharmaciesTable({ 
    pharmacists, 
    loading, 
    onApprove, 
    onReject, 
    onDelete, 
    onViewDetails,
    onInventoryClick,
    onOrdersClick
}: PharmaciesTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pharmacist Info</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pharmacy Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">License</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span>Loading pharmacies...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : pharmacists.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                                    No pharmacies found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            pharmacists.map((pharmacist) => (
                                <tr key={pharmacist.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-gray-100 flex-shrink-0">
                                                <AvatarImage src={pharmacist.pharmacistImage || ""} alt={pharmacist.email} className="object-cover" />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                                                    {pharmacist.email.substring(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm">{pharmacist.email.split('@')[0]}</div>
                                                <div className="text-xs text-gray-500">{pharmacist.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                {pharmacist.pharmacyImagePath ? (
                                                    <Image
                                                        src={pharmacist.pharmacyImagePath}
                                                        alt={pharmacist.pharmacyName}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-900 font-medium">{pharmacist.pharmacyName}</div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                                        <span>{pharmacist.city}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                                        <span>{pharmacist.pharmacyPhone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-[11px] font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                            {pharmacist.licenseNumber}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        {pharmacist.isApproved ? (
                                            <Badge variant="outline" className="px-2.5 py-0.5 font-medium bg-green-50 text-green-700 border-green-200">
                                                Approved
                                            </Badge>
                                        ) : pharmacist.isReject ? (
                                            <Badge variant="outline" className="px-2.5 py-0.5 font-medium bg-red-50 text-red-700 border-red-200">
                                                Rejected
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="px-2.5 py-0.5 font-medium bg-yellow-50 text-yellow-700 border-yellow-200">
                                                Pending
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                className="h-9 px-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all flex items-center gap-2"
                                                onClick={() => onInventoryClick?.(pharmacist)}
                                            >
                                                <Package className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Inventory</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-9 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all flex items-center gap-2"
                                                onClick={() => onOrdersClick?.(pharmacist)}
                                            >
                                                <ClipboardList className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Orders</span>
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {!pharmacist.isReject && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onViewDetails(pharmacist)}
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            )}
                                            
                                            {!pharmacist.isApproved && !pharmacist.isReject && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onApprove(pharmacist.id)}
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onReject(pharmacist.id)}
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(pharmacist.id)}
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
