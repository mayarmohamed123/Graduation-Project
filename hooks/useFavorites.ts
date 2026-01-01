import { useState, useEffect, useCallback } from "react";
import { favoritesService } from "@/Services/favoritesService";
import { FavoriteDoctor, FavoriteMedicine, FavoriteClinic } from "@/types/favorites";
import { toast } from "react-hot-toast";

export const useFavorites = () => {
  const [favoriteDoctors, setFavoriteDoctors] = useState<FavoriteDoctor[]>([]);
  const [favoriteMedicines, setFavoriteMedicines] = useState<FavoriteMedicine[]>([]);
  const [favoriteClinics, setFavoriteClinics] = useState<FavoriteClinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [doctors, medicines, clinics] = await Promise.all([
        favoritesService.getFavoriteDoctors(),
        favoritesService.getFavoriteMedicines(),
        favoritesService.getFavoriteClinics(),
      ]);
      setFavoriteDoctors(doctors);
      setFavoriteMedicines(medicines);
      setFavoriteClinics(clinics);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      const message = err instanceof Error ? err.message : "Failed to load favorites";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeDoctor = useCallback((id: number) => {
    setFavoriteDoctors((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  const removeMedicine = useCallback((id: number) => {
    setFavoriteMedicines((prev) => prev.filter((med) => med.id !== id));
  }, []);

  const removeClinic = useCallback((id: number) => {
    setFavoriteClinics((prev) => prev.filter((clinic) => clinic.id !== id));
  }, []);

  useEffect(() => {
    fetchAllFavorites();
  }, [fetchAllFavorites]);

  return {
    favoriteDoctors,
    favoriteMedicines,
    favoriteClinics,
    isLoading,
    error,
    refetch: fetchAllFavorites,
    removeDoctor,
    removeMedicine,
    removeClinic,
  };
};
