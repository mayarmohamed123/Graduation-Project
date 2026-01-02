import Image from "next/image";

interface PharmacyInfoCardProps {
    pharmacyName: string;
    pharmacyImage: string;
}

export default function PharmacyInfoCard({
    pharmacyName,
    pharmacyImage,
}: PharmacyInfoCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pharmacy Info
            </h2>
            <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {pharmacyImage && (
                        <Image
                            src={pharmacyImage}
                            alt={pharmacyName}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">{pharmacyName}</h3>
                </div>
            </div>

        </div>
    );
}
