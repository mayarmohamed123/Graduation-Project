"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { doctorService } from "@/Services/doctorService";
import toast from "react-hot-toast";

function DoctorSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        await doctorService.verifyPaymentSession(sessionId);
        toast.success("Payment verified successfully!");
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Failed to verify payment session.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#E5E5E5] p-4 font-sans">
      <div className="w-full max-w-lg">
        {/* Success Title */}
        <h1 className="text-[#AAAAAA] text-3xl font-normal mb-6 ml-2">Success</h1>

        {/* Success Card */}
        <div className="bg-white rounded-[32px] shadow-sm p-12 flex flex-col items-center text-center">
          {/* Green Checkmark Circle */}
          <div className="w-24 h-24 bg-[#2ECC71] rounded-full flex items-center justify-center mb-8">
            <Check className="text-white w-12 h-12 stroke-[3px]" />
          </div>

          {/* Success Message */}
          <h2 className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-4 px-4 leading-tight">
            Request submitted successfully! Awaiting admin approval.
          </h2>

          <p className="text-[#95A5A6] text-sm mb-10">
            Thank you For Your Trust
          </p>

          {/* Back to Home Button */}
          <Button
            onClick={() => router.push("/")}
            disabled={isVerifying}
            className="bg-[#2BBBC5] hover:bg-[#249DA5] text-white px-10 py-6 rounded-2xl text-base font-medium transition-all"
          >
             {isVerifying ? "Verifying..." : "Back to Home"}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function DoctorSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E5E5E5] p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BBBC5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    }>
      <DoctorSuccessContent />
    </Suspense>
  );
}
