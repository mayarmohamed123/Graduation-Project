import { Suspense } from "react";
import OrderDetailsContent from "@/Components/features/pharmacy/orders/details/OrderDetailsContent";
import { LoadingSpinner } from "@/Components";

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = await params;
    const orderId = parseInt(id);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
                <OrderDetailsContent orderId={orderId} />
            </Suspense>
        </div>
    );
}
