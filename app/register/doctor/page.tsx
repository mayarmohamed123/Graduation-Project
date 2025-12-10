"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, User, Phone, MapPin, Building, DollarSign, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  vector37,
  doctorsIllustration,
  vector36,
} from "@/assets";
import { doctorRegistrationSchema, type DoctorRegistrationFormData } from "@/lib/validations/doctor";
import { doctorService } from "@/services/doctorService";
import toast from "react-hot-toast";

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [clinicPreview, setClinicPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<DoctorRegistrationFormData>({
    resolver: zodResolver(doctorRegistrationSchema),
    mode: "onChange",
  });

  const profilePicture = watch("profilePicture");
  const clinicImage = watch("clinicImage");

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

  // Handle clinic image selection
  const handleClinicImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("clinicImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setClinicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigate to next step
  const handleNext = async () => {
    // Validate stage 1 fields before advancing
    const stage1Fields: (keyof DoctorRegistrationFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "specialty",
      "gender",
      "password",
    ];

    const isValid = await trigger(stage1Fields);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Form submission
  const onSubmit = async (data: DoctorRegistrationFormData) => {
    setIsLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append all form fields
      // Combine firstName and lastName as userName
      formData.append("userName", `${data.firstName}${data.lastName}`);
      formData.append("Email", data.email);
      formData.append("Specialty", data.specialty);
      formData.append("Gender", data.gender);
      formData.append("Password", data.password);
      formData.append("ClinicName", data.clinicName);
      formData.append("ClinicPhone", data.clinicPhoneNumber);
      
      // Append address fields in the correct format
      formData.append("ClinicAddress.Country", data.country);
      formData.append("ClinicAddress.City", data.city);
      formData.append("ClinicAddress.Street", data.street);
      
      formData.append("ConsultationType", data.consultationType);
      formData.append("consultationPrice", data.price);

      // Append files if they exist
      if (data.profilePicture) {
        formData.append("doctorImage", data.profilePicture);
      }
      if (data.clinicImage) {
        formData.append("clinicImage", data.clinicImage);
      }

      // Call the registration service
      const response = await doctorService.registerDoctor(formData);
      
      toast.success(response.message || "Registration successful! Awaiting admin approval.");
      
      // Navigate to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D5F4F6] relative overflow-hidden p-4">
      {/* Background vector - hidden on mobile */}
      <div className="absolute z-0 left-[-24px] hidden md:block">
        <Image src={vector36} alt="vector2" />
      </div>
      
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side (Image Section) - Hidden on mobile, visible on md+ */}
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
              Sign Up as a Doctor
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              {currentStep === 1 
                ? "Account info first, clinic/hospital next." 
                : "Your Clinic Information"}
            </p>

            {/* Stage 1: Personal/Account Information */}
            {currentStep === 1 && (
              <div className="space-y-3">
                {/* Profile Picture Upload */}
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

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("firstName")}
                        placeholder="First Name"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <div className="relative">
                    <Building
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("specialty")}
                      placeholder="Specialty"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.specialty && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.specialty.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <div className="relative">
                    <select
                      {...register("gender")}
                      className="w-full px-4 py-2 rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] focus:outline-none focus:border-[#2BBBC5] appearance-none bg-white"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
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

                {/* Next Button */}
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

            {/* Stage 2: Clinic Information */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {/* Clinic Image Upload */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="clinicImage"
                      accept="image/*"
                      onChange={handleClinicImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="clinicImage"
                      className="cursor-pointer block w-24 h-24 rounded-full bg-gray-100 border-2 border-[#2BBBC5] overflow-hidden"
                    >
                      {clinicPreview ? (
                        <Image
                          src={clinicPreview}
                          alt="Clinic preview"
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
                  Upload your clinic/hospital image
                </p>
                {errors.clinicImage && (
                  <p className="text-red-500 text-xs text-center mb-2">
                    {errors.clinicImage.message}
                  </p>
                )}

                {/* Clinic Name */}
                <div>
                  <div className="relative">
                    <Building
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                      size={18}
                    />
                    <Input
                      {...register("clinicName")}
                      placeholder="Clinic Name"
                      className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                    />
                  </div>
                  {errors.clinicName && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.clinicName.message}
                    </p>
                  )}
                </div>

                {/* Clinic Phone Number */}
                <div>
                  <div className="relative flex gap-2">
                    <select
                      className="rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] px-3 py-2 focus:outline-none focus:border-[#2BBBC5] w-24"
                      defaultValue="+20"
                    >
                      <option value="+20">+20</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("clinicPhoneNumber")}
                        type="tel"
                        placeholder="Clinic Phone Number"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                  </div>
                  {errors.clinicPhoneNumber && (
                    <p className="text-red-500 text-xs mt-1 ml-3">
                      {errors.clinicPhoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Location: Country, City, Street */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Country */}
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

                  {/* City */}
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

                  {/* Street */}
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

                {/* Consultation Type & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      {...register("consultationType")}
                      className="w-full px-4 py-2 rounded-3xl border-2 border-[#2BBBC5] text-[#2BBBC5] focus:outline-none focus:border-[#2BBBC5] appearance-none bg-white"
                    >
                      <option value="">Consultation type</option>
                      <option value="inclinic">In Clinic</option>
                      <option value="homevisit">Home Visit</option>
                      <option value="both">Both</option>
                    </select>
                    {errors.consultationType && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.consultationType.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2BBBC5]"
                        size={18}
                      />
                      <Input
                        {...register("price")}
                        type="text"
                        placeholder="Price"
                        className="pl-9 rounded-3xl border-2 border-[#2BBBC5] placeholder-[#2BBBC5] focus-visible:ring-0 focus-visible:border-[#2BBBC5]"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1 ml-3">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
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
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#2BBBC5] text-white rounded-3xl hover:bg-[#249da5] disabled:opacity-50"
                  >
                    {isLoading ? "Registering..." : "Next"}
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
          </form>
        </div>
      </div>
    </main>
  );
}
