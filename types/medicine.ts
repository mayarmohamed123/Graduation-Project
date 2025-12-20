import { Pharmacy } from "./pharmacy";

export interface Medicine {
  id: number;
  brandName: string;
  genericName: string;
  strength: string;
  atcCode: string;
  imagePath: string;
  price: number;
  quantity: number;
  dosageFormType: string;
  strengthUnit: string;
  genderSuitability: string;
  medicationCategory: string;
  averageRating: number;
  description: string;
  warning: string;
  suitableFor: string;
  notSuitableFor: string;
  composition: string;
  directionsForUse: string;
  pharmacy: Pharmacy;
}

export interface MedicineFilterParams {
  name?: string;
  dosageForm?: string;
  strengthUnit?: string;
  brandName?: string;
  genericName?: string;
  minPrice?: number;
  maxPrice?: number;
  genderSuitability?: string;
  category?: string;
}

export type MedicineSearchResponse = Medicine[] | { message: string };
