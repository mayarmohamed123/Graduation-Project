"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doctorService } from "@/Services/doctorService";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Check for both session_id (Stripe default) and sessionId (custom)
  const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

  // Initialize status based on sessionId presence to avoid useEffect setState warning
  const [status, setStatus] = useState<"loading" | "success" | "error">(() =>
    !sessionId ? "error" : "loading"
  );

  const hasVerified = useRef(false);

  useEffect(() => {
    if (!sessionId) return; // Status is already 'error' from initialization

    // Prevent double verification
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        await doctorService.verifyPaymentSession(sessionId);
        setStatus("success");
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-[#2BBBC5]/10 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 text-[#2BBBC5] animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your transaction...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-500 mt-2">
              We couldn&apos;t verify your payment. This might be because the link is invalid or expired.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Button
              className="w-full h-12 rounded-xl bg-[#2BBBC5] hover:bg-[#25A0A9] text-white font-bold"
              onClick={() => router.push("/")}
            >
              Return Home
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image
            src="/images/payment-success.png"
            alt="Payment Successful"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black font-outfit text-gray-900">Payment Done Successfully!</h1>
          <p className="text-gray-500 text-lg">
            Your transaction has been successfully processed. You will receive a confirmation shortly.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">What&apos;s Next?</h3>
          <ul className="text-left space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#2BBBC5] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <span>Check your email for receipts/details.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#2BBBC5] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <span>For appointments: Your booking is confirmed.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#2BBBC5] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <span>For registration: You can now access your account.</span>
            </li>
          </ul>
        </div>

        <div className="pt-2">
          <Button
            className="w-full h-14 rounded-2xl bg-[#2BBBC5] hover:bg-[#25A0A9] text-white font-bold text-lg shadow-lg shadow-[#2BBBC5]/20 transition-all hover:scale-[1.02] active:scale-95"
            onClick={() => router.push("/user")}
          >
            Return to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-20 h-20 bg-[#2BBBC5]/10 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="w-10 h-10 text-[#2BBBC5] animate-spin" />
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
