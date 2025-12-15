"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import Switch from "@/Components/common/Switch";
import { Tab } from "@/types/favorites";
import {
  vector37,
  doctorsIllustration,
  googleIcon,
  facebookIcon,
  vector36,
} from "@/assets";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<string>("user");

  const tabs: Tab[] = [
    { id: "user", label: "User" },
    { id: "doctor", label: "Doctor" },
    { id: "pharmacy", label: "Pharmacy" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccess(message);
      // Clear the message from URL
      router.replace("/login");
    }
  }, [searchParams, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch {
      // Error is handled in the login function with toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    const { authService } = await import("@/Services/authService");

    if (provider === "google") {
      authService.googleLogin();
    } else {
      authService.facebookLogin();
    }
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

            <h2 className="text-[#2BBBC5] text-4xl font-semibold mb-5 text-center">
              Sign In
            </h2>

            {/* Account Type Switch */}
            <div className="mb-6 flex justify-center">
              <Switch
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Email */}
            <div className="relative mb-4">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5] z-10"
                size={18}
              />
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="example@email.com"
                isInvalid={Boolean(errors.email?.message)}
                errorMessage={errors.email?.message}
                className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
              />
            </div>

            {/* Password */}
            <div className="relative mb-2">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5] z-10"
                size={18}
              />
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter password"
                isInvalid={Boolean(errors.password?.message)}
                errorMessage={errors.password?.message}
                className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4 mt-2">
              <a
                href="/forgot-password"
                className="text-sm text-[#2BBBC5] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="bg-[#2BBBC5] text-white px-8 py-3 rounded-3xl w-full hover:bg-[#249da5] disabled:opacity-50">
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Social Login - Only for User tab */}
            {activeTab === "user" && (
              <>
                {/* Or Section */}
                <div className="my-6 flex items-center gap-4">
                  <hr className="flex-1 border-t border-gray-200" />
                  <span className="text-sm text-gray-400">Or Sign In with</span>
                  <hr className="flex-1 border-t border-gray-200" />
                </div>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => handleSocialSignIn("google")}
                    disabled={isLoading}
                    className="hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Image src={googleIcon} alt="Google" width={35} height={35} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialSignIn("facebook")}
                    disabled={isLoading}
                    className="hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Image src={facebookIcon} alt="Facebook" width={35} height={35} />
                  </button>
                </div>
              </>
            )}

            {/* Register Link */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-teal-500 underline">
                Sign Up
              </a>
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#D5F4F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BBBC5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    }>
      <SignInForm />
    </Suspense>
  );
}
