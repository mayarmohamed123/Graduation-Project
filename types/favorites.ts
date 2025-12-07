// Types for Switch Component
export interface Tab {
  id: string;
  label: string;
}

export interface SwitchProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// Types for Favorite Items

export interface FavoriteDoctor {
  id: number;
  email: string;
  specialty: string;
  isApproved: boolean;
  gender: string;
  averageRating: number;
  username: string;
  consultationPrice: number;
  consultationType: string;
  clinicName: string;
  clinicPhone: string;
  clinicImagePath: string;
  doctorImage: string;
  city: string;
  postalCode: string;
  country: string;
  street: string;
  latitude: number;
  longitude: number;
  countPatient: number;
  countReviews: number;
  countFavourite: number;
}

export interface FavoriteMedicine {
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
  distanceFromUser: null;
}
export interface FavoriteClinic {
  id: number;
  name: string;
  phone: string;
  address: Address;
  imagePath: string;
}

export interface Address {
  id: number;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export type FavoriteItem = FavoriteDoctor | FavoriteMedicine | FavoriteClinic;

export interface FavoriteCardProps {
  item: FavoriteDoctor | FavoriteMedicine | FavoriteClinic;
  type: "doctor" | "medicine" | "clinic";
  onRemove?: (id: number) => void;
}
