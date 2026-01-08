import Image from "next/image";
import Link from "next/link";
import { Check, X, Trash2, Eye, Star, Users, Calendar } from "lucide-react";
import { AdminDoctor } from "@/types/admin";

interface DoctorsTableProps {
    doctors: AdminDoctor[];
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onDelete: (id: number) => void;
    onViewDetails: (doctor: AdminDoctor) => void;
}

export function DoctorsTable({ doctors, loading, onApprove, onReject, onDelete, onViewDetails }: DoctorsTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor Info</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stats</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Clinic & Price</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Loading doctors...
                                </td>
                            </tr>
                        ) : doctors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No doctors found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            doctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                {doctor.doctorImage ? (
                                                    <Image
                                                        src={doctor.doctorImage}
                                                        alt={doctor.email}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <span className="text-xs uppercase">{doctor.email?.substring(0, 2)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{doctor.username || doctor.email.split('@')[0]}</div>
                                                <div className="text-xs text-gray-500">{doctor.email}</div>
                                                <div className="text-xs text-primary mt-0.5">{doctor.specialty}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span>{doctor.averageRating?.toFixed(1) || "0.0"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{doctor.countPatient} Patients</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 font-medium">{doctor.clinicName}</div>
                                        <div className="text-xs text-gray-500">{doctor.city}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-semibold text-gray-900">${doctor.consultationPrice}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{doctor.consultationType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.isApproved
                                            ? "bg-green-100 text-green-800"
                                            : doctor.isRejected ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {doctor.isApproved ? "Approved" : doctor.isRejected ? "Rejected" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/doctors/${doctor.userId}/appointments`}
                                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Show Appointments"
                                            >
                                                <Calendar className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => onViewDetails(doctor)}
                                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                title="View Details & Edit"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {!doctor.isApproved && !doctor.isRejected && (
                                                <button
                                                    onClick={() => onApprove(doctor.id)}
                                                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            {!doctor.isApproved && !doctor.isRejected && (
                                                <button
                                                    onClick={() => onReject(doctor.id)}
                                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                                    title="Reject/Suspend"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            {doctor.isApproved || doctor.isRejected ? (<button
                                                onClick={() => onDelete(doctor.id)}
                                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            ) : (<></>)}
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
