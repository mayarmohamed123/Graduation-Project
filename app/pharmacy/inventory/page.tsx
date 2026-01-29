import { pharmacyService } from "@/Services/pharmaciesServices";
import InventoryClient from "./InventoryClient";
import { Medicine } from "@/types/medicine";
import { InventoryAnalysis, CategoryDashboardResponse } from "@/types/pharmacy";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  let medicines: Medicine[] = [];
  let analysis: InventoryAnalysis | null = null;
  let categDashboard: CategoryDashboardResponse | null = null;

  try {
    const [medicinesData, analysisData, categoriesData] = await Promise.all([
      pharmacyService.getPharmacyMedicines(),
      pharmacyService.getInventoryAnalysis(),
      pharmacyService.getCategoriesDashboard()
    ]);
    medicines = medicinesData;
    analysis = analysisData;
    categDashboard = categoriesData;
  } catch (error) {
    console.error("Failed to fetch pharmacy inventory data:", error);
  }

  return (
    <InventoryClient
      initialData={{
        medicines,
        analysis,
        categoriesData: categDashboard
      }}
    />
  );
}
