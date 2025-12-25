import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { userService } from "@/Services/userService";
import { toast } from "react-hot-toast";
import { profile2UserIcon } from "@/assets";
import { UserProfileForm } from "@/types";

export const useProfile = () => {
  const { user: userData, isLoading, refetchUser } = useUser();
  const [profile, setProfile] = useState<UserProfileForm>({
    username: "",
    email: "",
    phone: "",
    address: "",
    image: profile2UserIcon,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  useEffect(() => {
    if (userData) {
      Promise.resolve().then(() => {
        setProfile({
          username: userData.userName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          address: userData.address || "",
          image: userData.profileImage || profile2UserIcon,
        });
      });
    }
  }, [userData]);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, []);

  const saveProfile = useCallback(async () => {
    try {
      const response = await userService.updateProfile({
        userName: profile.username,
        email: profile.email,
        address: profile.address,
        phoneNumber: profile.phone,
      });
      toast.success(response.message || "Profile updated successfully");
      await refetchUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
      throw error;
    }
  }, [profile, refetchUser]);

  const uploadPicture = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      const response = await userService.uploadProfilePicture(file);
      toast.success(response.message || "Profile picture updated");
      
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
      
      await refetchUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile picture");
      throw error;
    }
  }, [refetchUser]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    profile,
    isLoading,
    fileInputRef,
    handleProfileChange,
    saveProfile,
    uploadPicture,
    triggerFileInput,
    refetch: refetchUser,
  };
};
