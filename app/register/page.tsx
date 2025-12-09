"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  vector37,
  doctorsIllustration,
  googleIcon,
  facebookIcon,
  vector36,
} from "@/assets";
import { useAuth } from "@/lib/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        phonenumber: data.phonenumber,
        address: data.address,
        password: data.password,
        confirmpassword: data.confirmPassword,
        role: "regularuser",
      });
    } catch (error) {
      // Error is handled in the register function with toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    // TODO: Implement social login flow
    alert(`Social login with ${provider} - To be implemented`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D5F4F6] relative overflow-hidden p-4">
      {/* Background vector - hidden on mobile */}
      <div className="absolute z-0 left-0 hidden md:block">
        <Image src={vector36} alt="vector2" />
      </div>
      
      <div className="flex flex-col md:flex-row max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side (Image Section) - Hidden on mobile, visible on md+ */}
        <div className="hidden md:block md:w-1/3 relative">
          <Image src={vector37} alt="vector" />
          <div className="absolute z-10 top-44 p-5">
            <Image src={doctorsIllustration} alt="doctors" width={270} height={265} />
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-2/3 flex flex-col justify-center p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[350px] mx-auto">
            <h2 className="text-[#2BBBC5] text-4xl font-semibold mb-5">
              Sign Up
            </h2>

            <div className="space-y-1">
              {/* Username */}
              <div className="relative mb-1">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="User Name"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mb-2 ml-3">{errors.username.message}</p>
              )}

              {/* Email */}
              <div className="relative mb-1 mt-3">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="example@email.com"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mb-2 ml-3">{errors.email.message}</p>
              )}

            {/* Phone Number */}
            <div className="relative mb-1 mt-3">
              <Input
                id="phonenumber"
                type="tel"
                {...register("phonenumber")}
                placeholder="Phone Number"
                className="pl-4 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
              />
            </div>
            {errors.phonenumber && (
              <p className="text-red-500 text-xs mb-2 ml-3">{errors.phonenumber.message}</p>
            )}

            {/* Address */}
            <div className="relative mb-1 mt-3">
              <Input
                id="address"
                {...register("address")}
                placeholder="City / Address"
                className="pl-4 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs mb-2 ml-3">{errors.address.message}</p>
            )}

              {/* Password */}
              <div className="relative mb-1 mt-3">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mb-2 ml-3">{errors.password.message}</p>
              )}

              {/* Confirm Password */}
              <div className="relative mb-1 mt-3">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm password"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mb-2 ml-3">{errors.confirmPassword.message}</p>
              )}

              {/* Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-[#2BBBC5] text-white px-8 py-3 rounded-3xl w-full hover:bg-[#249da5] disabled:opacity-50 mt-4">
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="my-6 flex items-center gap-4">
                <hr className="flex-1 border-t border-gray-200" />
                <span className="text-sm text-gray-400">Or Sign Up with</span>
                <hr className="flex-1 border-t border-gray-200" />
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => handleSocialSignIn("google")}
                  className="hover:scale-110 transition-transform duration-200">
                  <Image src={googleIcon} alt="Google" width={35} height={35} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignIn("facebook")}
                  className="hover:scale-110 transition-transform duration-200">
                  <Image src={facebookIcon} alt="Facebook" width={35} height={35} />
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-teal-500 underline">
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
