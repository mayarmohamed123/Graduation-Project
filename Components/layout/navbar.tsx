"use client";

import { Menu, X, Heart, ShoppingCart, Bell, User } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import sehhaLogo from "@/assets/Sehaa 1.png";
import favoriteIcon from "@/assets/mdi_heart-outline.svg";
import cartIcon from "@/assets/mdi_cart-outline.svg";
import notifIcon from "@/assets/ion_notifications-outline.svg";
import profileIcon from "@/assets/iconamoon_profile.svg";

export default function Navbar() {
  // simulate login (replace this with your auth logic later)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Join Us", href: "/join" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src={sehhaLogo}
              alt="Sehha Logo"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="text-2xl font-semibold text-primary">Sehha</span>
          </Link>

          {/* If user IS NOT logged in */}
          {!isLoggedIn ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-primary/900 hover:text-primary transition">
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                  Log In
                </Button>
                <Button className="rounded-full">Sign Up</Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-primary">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          ) : (
            /* If user IS logged in */
            <div className="flex items-center space-x-6">
              <Link href="/favorites">
                <Image
                  src={favoriteIcon}
                  alt="Favorite"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-70 transition"
                />
              </Link>
              <Link href="/cart">
                <Image
                  src={cartIcon}
                  alt="Cart"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-70 transition"
                />
              </Link>
              <Link href="/notifications">
                <Image
                  src={notifIcon}
                  alt="Notifications"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-70 transition"
                />
              </Link>
              <Link href="/profile">
                <Image
                  src={profileIcon}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-70 transition"
                />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown (only if not logged in) */}
      {!isLoggedIn && isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-primary/900 hover:text-primary transition"
                onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col mt-3 space-y-2">
              <Button variant="outline" className="w-full">
                Login
              </Button>
              <Button className="w-full">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
