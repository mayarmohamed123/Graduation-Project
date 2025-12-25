import { useEffect, useCallback } from "react";
import { userService } from "@/Services/userService";

export const useLocation = () => {
  const updateLocation = useCallback(async (latitude: number, longitude: number) => {
    try {
      await userService.updateUserLocation(latitude, longitude);
      console.log("Location updated successfully");
    } catch (error) {
      console.error("Error updating location:", error);
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [updateLocation]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { requestLocation };
};
