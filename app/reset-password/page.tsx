"use client";

import { useState, Suspense } from "react"; // Added Suspense import
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/Services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!email || !token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, token, data.password);
      toast.success("Password has been reset successfully!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. Link may be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full"> 
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
        <p className="text-gray-500 mb-6">
            This password reset link is invalid or missing required information.
        </p>
        <Button 
            onClick={() => router.push("/forgot-password")}
            className="bg-[#2BBBC5] hover:bg-[#25A0A9] text-white w-full rounded-xl"
        >
            Request New Link
        </Button>
      </div>
    ); 
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-black font-outfit text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-2">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`h-12 rounded-xl pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                disabled={isLoading}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`h-12 rounded-xl pr-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                disabled={isLoading}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#2BBBC5] hover:bg-[#25A0A9] text-white font-bold text-base shadow-lg shadow-[#2BBBC5]/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#2BBBC5]" />}>
                <ResetPasswordFormContent />
            </Suspense>
        </div>
    );
}
