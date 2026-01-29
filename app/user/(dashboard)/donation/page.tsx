"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  CheckCircle2,
  Droplet,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";

export default function DonationPage() {
  const router = useRouter();
  return (
    <div className="w-full max-w-6xl mx-auto pb-10 px-4 md:px-6 space-y-10">
      <PageHeaderWithBack title="Donation Dashboard" />
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-6 border-primary rounded-xl w-full max-w-2xl bg-white/50 backdrop-blur-sm">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full text-white">
              <Heart className="w-8 h-8 fill-current" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Donate Blood, Save Lives
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed px-4">
            Your single donation can save up to three lives. It&apos;s a simple,
            safe process that makes a world of difference. Ready to become a
            hero?
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
        <div className="p-1 rounded-full">
          <Button
            className="w-full h-12 rounded-full text-lg font-medium shadow-md transition-transform hover:scale-[1.02]"
            size="lg"
            onClick={() => router.push("/user/donation/eligibility")}
          >
            Check My Eligibility
          </Button>
        </div>
        <div className="p-1 rounded-full">
          <Button
            variant="outline"
            className="w-full h-12 rounded-full text-lg font-medium text-primary border-primary hover:bg-primary/10 hover:text-primary transition-transform hover:scale-[1.02]"
            size="lg"
            onClick={() => router.push("/user/donation/drive")}
          >
            Find a Drive & Schedule
          </Button>
        </div>
        <div className="p-1 rounded-full md:col-span-2">
          <Button
            variant="ghost"
            className="w-full h-12 rounded-full text-lg font-medium text-[#2BBBC5] border-2 border-[#2BBBC5] hover:bg-[#2BBBC5]/10 transition-transform hover:scale-[1.01]"
            size="lg"
            onClick={() => router.push("/user/donation/request")}
          >
            Request a Donation
          </Button>
        </div>
      </div>

      {/* Who Can Donate Section */}
      <div className="border-2 border-dashed border-primary rounded-xl p-6 md:p-8 bg-white/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-primary">
            Who Can Donate?
          </h2>
        </div>
        <ul className="space-y-4 ml-2 md:ml-4">
          {[
            "Generally in good health",
            "18-65 years old",
            "Weigh over 50 kg (110 lbs)",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-600">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* The Donation Process */}
      <div className="rounded-xl p-6 md:p-8 bg-white/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-full">
            <Droplet className="w-6 h-6 text-primary fill-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-primary">
            The Donation Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Registration",
              desc: "Health Quiz",
            },
            {
              step: "2",
              title: "Donation",
              desc: "10-15 minutes",
            },
            {
              step: "3",
              title: "Recovery",
              desc: "Refreshments & Rest",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 border border-primary rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-4xl font-bold text-primary mb-3">
                {item.step}
              </span>
              <h3 className="text-lg font-medium text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why It Matters */}
      <div className="rounded-xl p-6 md:p-8 bg-white/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-primary">
            Why It Matters
          </h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Your donation helps patients in surgeries, cancer treatments, trauma
          care, and those managing chronic illnesses. Every donation makes a real
          difference in someone&apos;s life.
        </p>
      </div>
    </div>
  );
}
