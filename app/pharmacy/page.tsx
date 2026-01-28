import { pharmacyService } from "@/Services/pharmaciesServices";
import { pharmacistService } from "@/Services/pharmacistService";
import { PharmacyStatsResponse, PharmacistOrder, BestSellingMedicine, TodaySalesByTime } from "@/types";
import PharmacyDashboardClient from "./PharmacyDashboardClient";

export default async function PharmacyDashboardPage() {
  let statsData: PharmacyStatsResponse | null = null;
  let recentOrders: PharmacistOrder[] = [];
  let bestSellers: BestSellingMedicine[] = [];
  let todaySales: TodaySalesByTime[] = [];

  try {
    const [statsRes, ordersRes, bestSellersRes, todaySalesRes] = await Promise.all([
      pharmacyService.getMyStats(),
      pharmacistService.getOrders(),
      pharmacyService.getBestSellingMedicine(),
      pharmacyService.getTodaySalesByTime()
    ]);
    statsData = statsRes;
    recentOrders = ordersRes.slice(0, 5);
    bestSellers = bestSellersRes;
    todaySales = todaySalesRes;
  } catch (error) {
    console.error("Error fetching pharmacy dashboard data on server:", error);
  }

  return (
    <PharmacyDashboardClient 
      initialData={{
        statsData,
        recentOrders,
        bestSellers,
        todaySales
      }} 
    />
  );
}
