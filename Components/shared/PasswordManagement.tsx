"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { userService } from "@/Services/userService";
import { toast } from "react-hot-toast";

export default function PasswordManagement() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Validation
    if (!passwords.current || !passwords.new) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // Call the API to update password
      const response = await userService.updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      // Show success toast with the message from API response
      toast.success(response.message);

      // Clear form
      setPasswords({ current: "", new: "" });
    } catch (error) {
      // Show error toast with error message
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-8">
        Personal information
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        <div className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current" className="text-primary">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current"
                name="current"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.current}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new" className="text-primary">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new"
                name="new"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.new}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary text-white px-8 py-3 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
