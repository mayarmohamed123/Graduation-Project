import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

interface CustomerDetailsCardProps {
    userName: string;
    userImage: string;
    userEmail: string;
    phoneNumber: string;
    street: string;
    city: string;
    country: string;
}

export default function CustomerDetailsCard({
    userName,
    userImage,
    userEmail,
    phoneNumber,
    street,
    city,
    country,
}: CustomerDetailsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Details
            </h2>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {userImage && (
                            <Image
                                src={userImage}
                                alt={userName}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{userName}</h3>
                        <p className="text-sm text-gray-500">Patient</p>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="text-gray-900">{userEmail}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="text-gray-900">{phoneNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-gray-500">Delivery Address</p>
                            <p className="text-gray-900">
                                {street}
                                <br />
                                {city}, {country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
