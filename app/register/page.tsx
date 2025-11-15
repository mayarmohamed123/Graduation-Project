"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, User } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import vector from "@/assets/Vector 37.png";
import doctors from "@/assets/amico.svg";
import google from "@/assets/Social Icons.svg";
import facebook from "@/assets/Social Icons (1).svg";
import vector2 from "@/assets/Vector 36.svg";
import { authService } from "@/Services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "regularuser",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Transform form data to match API requirements
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmpassword: formData.confirmPassword,
        role: formData.role,
      };
      await authService.register(registerData);

      // Auto-login after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push(
          `/login?message=${encodeURIComponent(
            "Registration successful. Please login."
          )}`
        );
      } else {
        router.push("/user");
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      await signIn(provider, { callbackUrl: "/user" });
    } catch (error) {
      setError(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D5F4F6] relative overflow-hidden">
      <div className="absolute z-0 left-0">
        <Image src={vector2} alt="vector2" />
      </div>
      <div className="flex max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/3 relative">
          <Image src={vector} alt="vector" />
          <div className="absolute z-10 top-44 p-5">
            <Image src={doctors} alt="doctors" width={270} height={265} />
          </div>
        </div>

        <div className="w-2/3 flex flex-col justify-center p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="w-[350px] mx-auto">
            <h2 className="text-[#2BBBC5] text-4xl font-semibold mb-5">
              Sign Up
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-1">
              {/* Username */}
              <div className="relative mb-4">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative mb-4">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="relative mb-4">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                  size={18}
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
                  required
                />
              </div>

              {/* Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-[#2BBBC5] text-white px-8 py-3 rounded-3xl w-full hover:bg-[#249da5] disabled:opacity-50">
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
                  <Image src={google} alt="Google" width={35} height={35} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignIn("facebook")}
                  className="hover:scale-110 transition-transform duration-200">
                  <Image src={facebook} alt="Facebook" width={35} height={35} />
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
