"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Mail, User, MapPin, Building, Camera, FileText, Phone, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  vector37,
  doctorsIllustration,
  vector36,
} from "@/assets";
import { pharmacyRegistrationSchema, type PharmacyRegistrationFormData } from "@/lib/validations/pharmacy";
import { pharmacyService } from "@/Services/pharmaciesServices";
import toast from "react-hot-toast";

export default function PharmacyRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [pharmacyPreview, setPharmacyPreview] = useState<string | null>(null);
  const [registeredPharmacistId, setRegisteredPharmacistId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<PharmacyRegistrationFormData>({
    resolver: zodResolver(pharmacyRegistrationSchema),
    mode: "onChange",
  });

  // Handle profile picture selection
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePicture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle pharmacy image selection
  const handlePharmacyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("pharmacyImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPharmacyPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigate to next step
  const handleNext = async () => {
    const stage1Fields: (keyof PharmacyRegistrationFormData)[] = [
      "userName",
      "email",
      "password",
      "profilePicture"
    ];

    const isValid = await trigger(stage1Fields);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  // Navigate to Step 3 after Step 2 (Performs Registration)
  const handleNextToPayment = async () => {
    const stage2Fields: (keyof PharmacyRegistrationFormData)[] = [
      "pharmacyName",
      "pharmacistPhoneNumber",
      "licenseNumber",
      "country",
      "city",
      "street",
      "pharmacyImage"
    ];

    const isValid = await trigger(stage2Fields);
    if (isValid) {
      setIsRegistering(true);
      try {
        const data = getValues();
        const formData = new FormData();
        
        formData.append("userName", data.userName);
        formData.append("Email", data.email);
        formData.append("Password", data.password);
        formData.append("PharmacyName", data.pharmacyName);
        formData.append("LicenseNumber", data.licenseNumber);
        formData.append("PhoneNumber", data.pharmacistPhoneNumber);
        
        formData.append("address.Country", data.country);
        formData.append("address.city", data.city);
        formData.append("address.Street", data.street);

        if (data.profilePicture) formData.append("pharmacistImage", data.profilePicture);
        if (data.pharmacyImage) formData.append("pharmacyImage", data.pharmacyImage);

        const response = await pharmacyService.register(formData);
        
        if (response.pharmacistId) {
          setRegisteredPharmacistId(response.pharmacistId);
          toast.success("Registration successful! Proceed to payment.");
          setCurrentStep(3);
        } else {
          throw new Error("Registration succeeded but no ID was returned.");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Registration failed");
      } finally {
        setIsRegistering(false);
      }
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Form submission (Step 3: Payment)
  const onSubmit = async () => {
    if (!registeredPharmacistId) {
      toast.error("Please complete registration first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await pharmacyService.createPharmacySubscriptionSession(registeredPharmacistId);
      
      if (response.sessionUrl) {
        window.location.href = response.sessionUrl;
      } else {
        throw new Error("Payment session creation failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D5F4F6] relative overflow-hidden p-4">
      {/* Background vector */}
      <div className="absolute z-0 left-[-24px] hidden md:block">
        <Image src={vector36} alt="vector2" />
      </div>
      
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side (Image Section) */}
        <div className="hidden md:block md:w-1/3 relative">
          <Image src={vector37} alt="vector" />
          <div className="absolute z-10 top-44 p-5">
            <Image src={doctorsIllustration} alt="doctors" width={270} height={265} />
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-2/3 flex flex-col justify-center p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[450px] mx-auto">
            <h2 className="text-[#2BBBC5] text-3xl font-semibold mb-2">
              Sign Up as a Pharmacist
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              {currentStep === 1 
                ? "Account info first, Pharmacy next." 
                : "Your Pharmacy Information"}
            </p>

            {/* Stage 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="cursor-pointer block w-24 h-24 rounded-full bg-gray-100 border-2 border-[#2BBBC5] overflow-hidden"
                    >
                      {profilePreview ? (
                        <Image
                          src={profilePreview}
                          alt="Profile preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="text-[#2BBBC5]" size={32} />
                        </div>
                      )}
                    </label>
                    <div className="absolute bottom-0 right-0 bg-[#2BBBC5] rounded-full p-1.5">
                      <Camera className="text-white" size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 -mt-2 mb-3">
                  Upload your profile picture
                </p>
                {errors.profilePicture && (
                  <p className="text-red-500 text-xs text-center mb-2">
                    {errors.profilePicture.message}
                  </p>
                )}

                <div>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("userName")}
                      placeholder="User Name"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.userName && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#2BBBC5] text-white px-8 py-3 rounded-3xl w-full hover:bg-[#249da5] mt-4"
                >
                  Next
                </Button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="text-[#2BBBC5] underline">
                    Sign In
                  </a>
                </p>
              </div>
            )}

            {/* Stage 2: Pharmacy Information */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="pharmacyImage"
                      accept="image/*"
                      onChange={handlePharmacyImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="pharmacyImage"
                      className="cursor-pointer block w-24 h-24 rounded-full bg-gray-100 border-2 border-[#2BBBC5] overflow-hidden"
                    >
                      {pharmacyPreview ? (
                        <Image
                          src={pharmacyPreview}
                          alt="Pharmacy preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="text-[#2BBBC5]" size={32} />
                        </div>
                      )}
                    </label>
                    <div className="absolute bottom-0 right-0 bg-[#2BBBC5] rounded-full p-1.5">
                      <Camera className="text-white" size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 -mt-2 mb-3">
                  Upload your pharmacy image
                </p>
                {errors.pharmacyImage && (
                  <p className="text-red-500 text-xs text-center mb-2">
                    {errors.pharmacyImage.message}
                  </p>
                )}

                <div>
                  <div className="relative">
                    <Building
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("pharmacyName")}
                      placeholder="Pharmacy Name"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.pharmacyName && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.pharmacyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("pharmacistPhoneNumber")}
                      placeholder="Phone Number"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.pharmacistPhoneNumber && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.pharmacistPhoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <FileText
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("licenseNumber")}
                      placeholder="License Number"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("country")}
                        placeholder="Country"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("city")}
                        placeholder="City"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("street")}
                        placeholder="Street"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextToPayment}
                    disabled={isRegistering}
                    className="flex-1 bg-[#2BBBC5] text-white rounded-3xl hover:bg-[#249da5] disabled:opacity-50"
                  >
                    {isRegistering ? "Registering..." : "Next"}
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="text-[#2BBBC5] underline">
                    Sign In
                  </a>
                </p>
              </div>
            )}

            {/* Stage 3: Payment Section */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-[#f0f9fa] p-6 rounded-2xl border-2 border-dashed border-[#2BBBC5] text-center">
                  <DollarSign className="mx-auto text-[#2BBBC5] mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#2BBBC5] mb-2">Pharmacy Subscription</h3>
                  <p className="text-gray-600">
                    To register your pharmacy on our platform, a one-time subscription fee of 
                    <span className="font-bold text-[#2BBBC5]"> $200 </span>
                    is required.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 italic">
                    By clicking &quot;Agree & Pay&quot;, you agree to our terms of service regarding pharmacy registration. 
                    You will be redirected to Stripe to complete the transaction.
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-[#2BBBC5] text-white rounded-3xl hover:bg-[#249da5] disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Agree & Pay"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
