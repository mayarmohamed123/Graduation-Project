import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { EmailInput, MessageTextarea } from "@/Components";

export default function ContactSection() {
  return (
    <section id="contact" className="px-8 md:px-20 py-20 bg-gray-50 relative">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="heading mb-4">Contact Us</h2>
      </div>

      {/* Contact Container */}
      <div className="flex flex-col md:flex-row mx-auto bg-[#E9F9FA] max-w-6xl w-full rounded-2xl shadow-xl p-6 md:p-10 lg:p-16 gap-8">
        {/* Form Section */}
        <div className="md:w-1/3 relative md:order-2 z-50">
          <div className="flex flex-col justify-center items-center md:absolute md:top-4 md:right-10 bg-[#2BBBC5] p-8 md:p-10 text-white rounded-2xl shadow-lg w-full md:w-[408px] md:h-[420px]">
            <h3 className="text-3xl font-semibold text-white mb-8">
              Contact Us
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="w-6">
                  <MapPin size={16} />
                </span>
                <p className="font-medium">Cairo, Egypt</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-6">
                  <Mail size={16} />
                </span>
                <p className="font-medium">Support@Sehha.com</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-6">
                  <Phone size={16} />
                </span>
                <p className="font-medium">+20 101 234 5678</p>
              </div>
            </div>
          </div>
        </div>
        <form className="w-full md:w-2/3 flex flex-col justify-center space-y-6 md:order-1 relative z-0">
          <div className="w-full">
            <h3 className="text-[#4D4D4D] font-medium text-2xl mb-2">
              Get in Touch
            </h3>
            <p className="text-[#8E8E8E] text-[14px] mb-8">
              Have a question? We’re always ready to assist you.
            </p>
            <Input
              type="text"
              placeholder="Name"
              className="rounded-xl text-[#B2B2B2] bg-white border-[#D4D4D4] focus-visible:ring-[#2BBBC5] mb-4 relative z-0"
            />
            <div className="relative z-0">
               <EmailInput />
            </div>
            <div className="relative z-0">
               <MessageTextarea />
            </div>

            <Button
              type="submit"
              className="bg-linear-to-r from-[#81DDE4] to-[#2BBBC5] text-white font-semibold px-8 py-6 rounded-full text-lg hover:opacity-90 transition-all">
              Send
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
