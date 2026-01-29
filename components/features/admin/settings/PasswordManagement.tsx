"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/Services/admin/adminService";
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
      // Call the API to update admin password
      const response = await adminService.updateAdminPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      // Show success toast with the message from API response
      toast.success(response.message || "Password updated successfully!");

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
        Password management
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        <div className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current" className="text-primary font-medium">
              Current Password
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Lock size={18} />
              </div>
              <Input
                id="current"
                name="current"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.current}
                onChange={handleChange}
                className="pl-10 pr-10 rounded-3xl border-2 border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-11"
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
            <Label htmlFor="new" className="text-primary font-medium">
              New Password
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Lock size={18} />
              </div>
              <Input
                id="new"
                name="new"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwords.new}
                onChange={handleChange}
                className="pl-10 pr-10 rounded-3xl border-2 border-primary placeholder-primary focus-visible:ring-0 focus-visible:border-primary h-11"
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
        <div className="mt-8">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-primary text-white rounded-3xl py-6 text-lg hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-70">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
