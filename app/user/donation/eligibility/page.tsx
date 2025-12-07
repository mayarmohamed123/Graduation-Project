"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type Answers = {
  goodHealth: boolean | null;
  age: string;
  weight: string;
  recentProcedures: boolean | null;
};

export default function EligibilityPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [ineligibleReasons, setIneligibleReasons] = useState<string[]>([]);

  const [answers, setAnswers] = useState<Answers>({
    goodHealth: null,
    age: "",
    weight: "",
    recentProcedures: null,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    const reasons: string[] = [];
    const ageNum = parseInt(answers.age);
    const weightNum = parseInt(answers.weight);

    // Logic for eligibility
    // 1. Good Health: Must be Yes
    if (answers.goodHealth !== true) {
      reasons.push("Health requirements (must be generally healthy)");
    }
    // 2. Age: 18-65 (Standard rule approximation)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      reasons.push("Age requirements (typically 18-65 years old)");
    }
    // 3. Weight: >= 50kg (Standard rule)
    if (isNaN(weightNum) || weightNum < 50) {
      reasons.push("Weight requirements (minimum 50kg)");
    }
    // 4. Recent Procedures: Must be No
    if (answers.recentProcedures === true) {
      reasons.push("Recent procedures (surgery, tattoos, or piercings in last 6 months)");
    }

    setIneligibleReasons(reasons);
    setIsEligible(reasons.length === 0);
    setIsSubmitted(true);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  // Validation for current step to enable "Next" button
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return answers.goodHealth !== null;
      case 2:
        return answers.age.trim() !== "" && !isNaN(parseInt(answers.age));
      case 3:
        return answers.weight.trim() !== "" && !isNaN(parseInt(answers.weight));
      case 4:
        return answers.recentProcedures !== null;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-lg text-center border border-gray-100">
          {isEligible ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">You&apos;re Likely Eligible!</h2>
              <p className="text-gray-600 text-base">
                Great news! Based on your answers, you appear to be a suitable candidate. 
                Please note that final eligibility will be confirmed on-site by our medical staff.
              </p>
              <div className="w-full pt-4">
                 <Button 
                  onClick={() => router.push("/user/donation")} 
                  className="w-full h-12 text-lg rounded-full bg-[#2BBBC5] hover:bg-[#25a4ac] text-white shadow-sm"
                 >
                   Find a Donation Center
                 </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4">
                 <AlertCircle className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Let&apos;s Review a Few Things</h2>
              <p className="text-gray-600 text-base">
                Some of your answers need a quick review with our guidelines. This is to ensure 
                your safety and the safety of the patients receiving blood.
              </p>
              
              <div className="bg-[#FFF8F0] border border-[#FFE4C4] rounded-2xl p-6 w-full text-left my-4">
                <h3 className="font-semibold text-gray-800 text-base mb-3">Areas to review:</h3>
                 <ul className="space-y-2">
                   {ineligibleReasons.map((reason, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                       {reason}
                     </li>
                   ))}
                 </ul>
              </div>

              <Button 
                onClick={() => router.push("/user/donation")} 
                variant="outline"
                className="w-full h-12 text-lg rounded-full border-[#2BBBC5] text-[#2BBBC5] hover:bg-[#2BBBC5]/5"
              >
                Review Guidelines
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full px-4">
        {/* Simple Header for Wizard */}
        <div className="mb-6">
           <PageHeaderWithBack title="" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 min-h-[450px] flex flex-col">
            
            {/* Wizard Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#2BBBC5] mb-2">Quick Eligibility Check</h1>
              <p className="text-gray-500 text-sm">Let&apos;s make sure you&apos;re ready to donate. This will only take a minute.</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2BBBC5] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-gray-900">Are you generally in good health and feeling well today?</h2>
                  <div className="space-y-3">
                    <label 
                      className={`
                        flex items-center gap-3 p-3 rounded-full border cursor-pointer transition-all
                        ${answers.goodHealth === true 
                          ? "border-[#2BBBC5] bg-[#E9F9FA]" 
                          : "border-gray-200 hover:border-[#2BBBC5]/50"
                        }
                      `}
                    >
                       <div className={`
                         w-5 h-5 rounded-full border-2 flex items-center justify-center
                         ${answers.goodHealth === true ? "border-[#2BBBC5]" : "border-gray-300"}
                       `}>
                          {answers.goodHealth === true && <div className="w-2.5 h-2.5 rounded-full bg-[#2BBBC5]" />}
                       </div>
                       <input 
                         type="radio" 
                         name="health" 
                         className="hidden" 
                         onChange={() => setAnswers({...answers, goodHealth: true})}
                         checked={answers.goodHealth === true}
                       />
                       <span className="text-base text-gray-700">Yes</span>
                    </label>

                    <label 
                      className={`
                        flex items-center gap-3 p-3 rounded-full border cursor-pointer transition-all
                        ${answers.goodHealth === false 
                          ? "border-[#2BBBC5] bg-[#E9F9FA]" 
                          : "border-gray-200 hover:border-[#2BBBC5]/50"
                        }
                      `}
                    >
                       <div className={`
                         w-5 h-5 rounded-full border-2 flex items-center justify-center
                         ${answers.goodHealth === false ? "border-[#2BBBC5]" : "border-gray-300"}
                       `}>
                          {answers.goodHealth === false && <div className="w-2.5 h-2.5 rounded-full bg-[#2BBBC5]" />}
                       </div>
                       <input 
                         type="radio" 
                         name="health" 
                         className="hidden" 
                         onChange={() => setAnswers({...answers, goodHealth: false})}
                         checked={answers.goodHealth === false}
                       />
                       <span className="text-base text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-gray-900">What is your age?</h2>
                  <div className="max-w-md">
                    <div className="relative">
                       <Input
                         type="number"
                         placeholder="Enter your age"
                         value={answers.age}
                         onChange={(e) => setAnswers({...answers, age: e.target.value})}
                         className="h-12 rounded-full text-base px-5 border-gray-200 focus:border-[#2BBBC5] focus:ring-0"
                       />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-gray-900">What is your Weight?</h2>
                  <div className="max-w-md relative">
                     <Input
                       type="number"
                       placeholder="Enter your weight"
                       value={answers.weight}
                       onChange={(e) => setAnswers({...answers, weight: e.target.value})}
                       className="h-12 rounded-full text-base px-5 border-gray-200 focus:border-[#2BBBC5] focus:ring-0 pr-12"
                     />
                     <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">kg</span>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-gray-900">Have you had any recent procedures, tattoos, or piercings in the last 6 months?</h2>
                  <div className="space-y-3">
                    <label 
                      className={`
                        flex items-center gap-3 p-3 rounded-full border cursor-pointer transition-all
                        ${answers.recentProcedures === true 
                          ? "border-[#2BBBC5] bg-[#E9F9FA]" 
                          : "border-gray-200 hover:border-[#2BBBC5]/50"
                        }
                      `}
                    >
                       <div className={`
                         w-5 h-5 rounded-full border-2 flex items-center justify-center
                         ${answers.recentProcedures === true ? "border-[#2BBBC5]" : "border-gray-300"}
                       `}>
                          {answers.recentProcedures === true && <div className="w-2.5 h-2.5 rounded-full bg-[#2BBBC5]" />}
                       </div>
                       <input 
                         type="radio" 
                         name="procedure" 
                         className="hidden" 
                         onChange={() => setAnswers({...answers, recentProcedures: true})}
                         checked={answers.recentProcedures === true}
                       />
                       <span className="text-base text-gray-700">Yes</span>
                    </label>

                    <label 
                      className={`
                        flex items-center gap-3 p-3 rounded-full border cursor-pointer transition-all
                        ${answers.recentProcedures === false 
                          ? "border-[#2BBBC5] bg-[#E9F9FA]" 
                          : "border-gray-200 hover:border-[#2BBBC5]/50"
                        }
                      `}
                    >
                       <div className={`
                         w-5 h-5 rounded-full border-2 flex items-center justify-center
                         ${answers.recentProcedures === false ? "border-[#2BBBC5]" : "border-gray-300"}
                       `}>
                          {answers.recentProcedures === false && <div className="w-2.5 h-2.5 rounded-full bg-[#2BBBC5]" />}
                       </div>
                       <input 
                         type="radio" 
                         name="procedure" 
                         className="hidden" 
                         onChange={() => setAnswers({...answers, recentProcedures: false})}
                         checked={answers.recentProcedures === false}
                       />
                       <span className="text-base text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8 mt-auto">
               <Button
                 onClick={handleBack}
                 variant="secondary" // Gray/Secondary style
                 className="flex-1 h-12 rounded-full text-base font-medium bg-[#9CA3AF] text-white hover:bg-[#6B7280] transition-colors"
               >
                 Back
               </Button>
               
               <Button
                 onClick={handleNext}
                 disabled={!isStepValid()}
                 className={`
                   flex-1 h-12 rounded-full text-base font-medium transition-colors
                   ${!isStepValid() 
                     ? "bg-[#2BBBC5]/50 cursor-not-allowed text-white" 
                     : "bg-[#2BBBC5] hover:bg-[#25a4ac] text-white shadow-md hover:shadow-lg"
                   }
                 `}
               >
                 {currentStep === totalSteps ? "Finish" : "Next"}
               </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
