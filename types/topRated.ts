// types/Doctor.ts
export interface TopRatedDoctor {
  id: number;
  doctorName: string;
  specialty: string;
  image: string; // path or URL to image
  averageRating: number;
}
