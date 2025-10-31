import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import sehhaLogo from "@/assets/Footer Logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#259FA7] text-white py-12 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* 1️⃣ Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src={sehhaLogo} alt="Sehaa Logo" width={40} height={40} />
            <h2 className="text-xl font-semibold">Sehaa</h2>
          </div>
          <p className="text-sm text-gray-100 mb-6">
            Your trusted digital healthcare platform. <br />
            Connecting patients, doctors, and pharmacies <br />
            to make healthcare accessible for everyone.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f text-white hover:text-gray-200"></i>
            </Link>
            <Link href="#" aria-label="Twitter">
              <i className="fab fa-twitter text-white hover:text-gray-200"></i>
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in text-white hover:text-gray-200"></i>
            </Link>
            <Link href="#" aria-label="Instagram">
              <i className="fab fa-instagram text-white hover:text-gray-200"></i>
            </Link>
          </div>
        </div>

        {/* 2️⃣ Pages */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pages</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Home</Link>
            </li>
            <li>
              <Link href="#">About</Link>
            </li>
            <li>
              <Link href="#">Service</Link>
            </li>
            <li>
              <Link href="#">How it Works</Link>
            </li>
            <li>
              <Link href="#">Join Us</Link>
            </li>
          </ul>
        </div>

        {/* 3️⃣ Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="#">FAQs</Link>
            </li>
          </ul>
        </div>

        {/* 4️⃣ Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Cairo, Egypt
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> Support@Sehaa.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +20 101 234 5678
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
