import vector from "@/assets/Vector 37.png";
import Image from "next/image";
import doctors from "@/assets/amico.svg";
import { Input } from "@/Components/ui/input";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/Components/ui/button";
import google from "@/assets/Social Icons.svg";
import facebook from "@/assets/Social Icons (1).svg";
import vector2 from "@/assets/Vector 36.svg";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D5F4F6] relative overflow-hidden">
      <div className="absolute z-0 left-0">
        <Image src={vector2} alt="vector2" />
      </div>

      <div className="flex max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side (Image Section) */}
        <div className="w-1/3 relative">
          <Image src={vector} alt="vector" />
          <div className="absolute z-10 top-44 p-5">
            <Image src={doctors} alt="doctors" width={270} height={265} />
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-2/3 flex flex-col justify-center p-8 max-w-2xl mx-auto">
          <form className="w-[350px] mx-auto">
            <h2 className="text-[#2BBBC5] text-4xl font-semibold mb-5 text-center">
              Sign In
            </h2>

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
                placeholder="example@email.com"
                className="pl-9 rounded-3xl border-2 border-[#2BBBC5]
                placeholder-[#2BBBC5] focus-visible:ring-0
                focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
              />
            </div>

            {/* Password */}
            <div className="relative mb-2">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                size={18}
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                className="pl-9 rounded-3xl border-2 border-[#2BBBC5]
                placeholder-[#2BBBC5] focus-visible:ring-0
                focus-visible:border-[#2BBBC5] focus:border-[#2BBBC5]"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <a
                href="/forgot-password"
                className="text-sm text-[#2BBBC5] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Button */}
            <Button
              size="lg"
              className="bg-[#2BBBC5] text-white px-8 py-3 rounded-3xl w-full">
              Sign In
            </Button>

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
                className="hover:scale-110 transition-transform duration-200">
                <Image src={google} alt="Google" width={35} height={35} />
              </button>
              <button
                type="button"
                className="hover:scale-110 transition-transform duration-200">
                <Image src={facebook} alt="Facebook" width={35} height={35} />
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Don’t have an account?{" "}
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
