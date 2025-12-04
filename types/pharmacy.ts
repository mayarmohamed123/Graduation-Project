export interface Pharmacy {
  id: number;
  name: string;
  phone: string;
  averageRating: number;
  city: string;
  imagePath: string;
  postalCode: string;
  country: string;
  street: string;
  latitude: number;
  longitude: number;
  distanceFromUser?: number | null;
}

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
  dosageForm?: string;
  strengthUnit?: string;
  brandName?: string;
  genericName?: string;
  minPrice?: number;
  maxPrice?: number;
  genderSuitability?: string;
}
