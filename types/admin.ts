export interface AdminDoctor {
  id: number;
  userId: string;
  email: string;
  specialty: string;
  isApproved: boolean;
  isRejected: boolean;
  gender: string;
  averageRating: number;
  username: string;
  consultationPrice: number;
  consultationType: string;
  clinicId: number;
  clinicName: string;
  clinicPhone: string;
  clinicImagePath: string;
  doctorImage: string | null;
  city: string;
  postalCode: string | null;
  country: string;
  street: string;
  latitude: number | null;
  longitude: number | null;
  countPatient: number;
  countReviews: number;
  countFavourite: number;
}

export interface DoctorProfileData {
  username?: string;
  email?: string;
  specialty?: string;
  image?: File | string;
  consultationPrice?: number;
  consultationType?: string;
}

export interface ClinicInfoData {
  name?: string;
  Phone?: string;
  ConsultationPrice?: number;
  city?: string;
  street?: string;
  country?: string;
  ConsultationType?: string;
  image?: File | string;
}
export interface AdminPharmacist {
  id: number;
  email: string;
  userId: string;
  userName: string;
  pharmacistImage: string | null;
  licenseNumber: string;
  isApproved: boolean;
  isReject: boolean;
  pharmacyId: number;
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyImagePath: string;
  city: string;
}

export interface AdminPharmacyDetails {
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
  distanceFromUser: number | null;
  deliveryFee: number;
}

export interface AdminMedicine {
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
  pharmacy: {
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
    distanceFromUser: number | null;
    deliveryFee: number;
  };
}
export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  profileImage: string | null;
  phoneNumber: string | null;
}
export interface OrderItem {
  medicationId: number;
  medicicationImage: string;
  medicationName: string;
  quantity: number;
  unitPrice: number;
}

export interface UserOrder {
  id: number;
  userId: string;
  userName: string;
  userImage: string;
  userEmail: string;
  pharmacyId: number;
  pharmacyName: string;
  pharmacyImage: string;
  city: string;
  country: string;
  street: string;
  phoneNumber: string;
  totalPrice: number;
  delieveryFee: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}
export interface DoctorPatient {
  appointmentId: number;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientId: string;
  patientGender: string;
  startAt: string;
  endAt: string;
  status: string;
  isPaid: boolean;
  clinicName: string;
}

export interface AdminPayment {
  id: number;
  referenceId: string;
  paymentFor:
    | "order"
    | "appointment"
    | "doctorRegistration"
    | "pharmacistRegistration";
  paymentForName: string;
  status: string;
  amount: number;
  processedAt: string;
  payerUserId: string;
  payerName: string;
  payerPhone: string | null;
  payerAddress: string | null;
  payerLongitude: number | null;
  payerLatitude: number | null;
  payerImage: string;
  payerEmail: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  profileImage: string | null;
  address: string | null;
}
