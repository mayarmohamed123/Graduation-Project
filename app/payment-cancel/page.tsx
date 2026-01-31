import { XCircle, AlertCircle } from "lucide-react";


export default function PaymentCancelPage() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="relative">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto relative z-10">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-50 rounded-full animate-pulse z-0"></div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black font-outfit text-gray-900">Payment Cancelled</h1>
          <p className="text-gray-500 text-lg">
            Your payment process was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Did something go wrong?</h3>
          <ul className="text-left space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>If you encountered an error, please try again.</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Check your internet connection and payment details.</span>
            </li>
          </ul>
        </div>

     
      </div>
    </div>
  );
}
