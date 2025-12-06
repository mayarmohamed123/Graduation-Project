import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { EmailInput, MessageTextarea } from "@/Components";

export default function ContactSection() {
  return (
    <section id="contact" className="px-8 md:px-20 py-20 relative">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="heading mb-4 text-[#2BBBC5]">Contact Us</h2>
      </div>

      {/* Main Container */}
      <div className="relative mx-auto bg-[#EDFCFE] max-w-6xl w-full rounded-[30px] p-6 md:p-12 lg:p-16 flex flex-col md:block">
        
        {/* Contact Info Card (Floating Left) */}
        <div className="flex flex-col justify-center items-start bg-[#2BBBC5] p-8 md:p-10 text-white rounded-[20px] shadow-lg w-full md:w-[380px] md:h-[480px] md:absolute md:-left-4 md:top-1/2 md:-translate-y-1/2 z-20 mb-8 md:mb-0">
          <h3 className="text-3xl font-semibold text-white mb-7">
            Contact Us
          </h3>
          <div className="flex flex-col gap-8 w-full">
             {/* MapPin not in design image provided? Usually text is simpler. I'll stick to icons + text. */}
            <div className="flex items-center gap-4">
              <span className="w-6 flex justify-center">
                 <MapPin size={24} />
              </span>
              <p className="font-medium text-lg">Cairo, Egypt</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-6 flex justify-center">
                 <Mail size={24} />
              </span>
              <p className="font-medium text-lg">Support@Sehha.com</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-6 flex justify-center">
                 <Phone size={24} />
              </span>
              <p className="font-medium text-lg">+20 101 234 5678</p>
            </div>
          </div>
        </div>

        {/* Form Section (Right Side) */}
        <form className="w-full md:w-[60%] md:ml-auto flex flex-col justify-center relative z-10 pl-0 md:pl-10">
          <div className="w-full">
            <h3 className="text-[#333333] font-bold text-2xl mb-2">
              Get in Touch
            </h3>
            <p className="text-[#8E8E8E] text-sm mb-8">
              Have a question? We’re always ready to assist you.
            </p>
            
            <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Name"
                  className="rounded-xl h-12 px-4 text-gray-700 bg-white border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#2BBBC5] placeholder:text-gray-400"
                />
                <div className="relative">
                   <EmailInput />
                </div>
                <div className="relative">
                   <MessageTextarea />
                </div>
            </div>

            <div className="mt-6 md:mt-8">
                <Button
                  type="submit"
                  className="bg-[#58D2DA] hover:bg-[#2BBBC5] text-white font-medium px-10 py-6 rounded-full text-lg shadow-md transition-all w-full md:w-auto">
                  Send
                </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
