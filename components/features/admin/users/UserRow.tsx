"use client";

import Image from "next/image";
import { User, Mail, MapPin, Phone, ClipboardList, Calendar } from "lucide-react";
import { AdminUser } from "@/types/admin";
import Link from "next/link";

interface UserRowProps {
    user: AdminUser;
}

export function UserRow({ user }: UserRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        {user.profileImage ? (
                            <Image
                                src={user.profileImage.startsWith("http") ? user.profileImage : (user.profileImage.startsWith("/") ? user.profileImage : `/${user.profileImage}`)}
                                alt={user.userName}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{user.userName}</div>
                        <div className="text-xs text-gray-500 font-mono">{user.id.substring(0, 8)}...</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                    </div>
                    {user.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{user.phoneNumber}</span>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                {user.address ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{user.address}</span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400 italic">Not specified</span>
                )}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/admin/users/${user.id}/orders`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Show Orders"
                    >
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span>Orders</span>
                    </Link>
                    <Link
                        href={`/admin/users/${user.id}/appointments`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Show Appointments"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Appts</span>
                    </Link>
                </div>
            </td>
        </tr>
    );
}
