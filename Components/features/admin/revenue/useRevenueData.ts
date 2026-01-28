import { useState, useEffect, useCallback, useMemo } from "react";
import { adminService } from "@/Services/admin/adminService";
import { AdminPayment } from "@/types/admin";
import { toast } from "react-hot-toast";

export type PaymentType = "orders" | "appointments" | "doctors" | "pharmacists";

export function useRevenueData() {
    const [activeTab, setActiveTab] = useState<PaymentType>("orders");
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [loading, setLoading] = useState(true);

    const totalRevenue = useMemo(() => {
        return payments.reduce((acc, curr) => acc + curr.amount, 0);
    }, [payments]);

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            let data: AdminPayment[] = [];

            switch (activeTab) {
                case "orders":
                    data = await adminService.getOrderPayments();
                    break;
                case "appointments":
                    data = await adminService.getAppointmentPayments();
                    break;
                case "doctors":
                    data = await adminService.getDoctorRegistrationPayments();
                    break;
                case "pharmacists":
                    data = await adminService.getPharmacistRegistrationPayments();
                    break;
            }

            setPayments(data);
        } catch (err) {
            console.error("Failed to fetch payments:", err);
            toast.error("Failed to load payment records");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return {
        activeTab,
        setActiveTab,
        payments,
        loading,
        totalRevenue,
        refresh: fetchPayments
    };
}
