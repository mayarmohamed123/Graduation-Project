"use client";

import { Menu, X, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui";
import Image from "next/image";
import Link from "next/link";
import {
  sehhaLogo,
} from "@/assets";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";
import { useAuthToken } from "@/hooks/useAuthToken";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, Bell, User } from "lucide-react";


export default function Navbar() {
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState("home");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isLoggedIn = !!session;
  const dispatch = useAppDispatch();
  const cartTotalItems = useAppSelector((state) => state.cart.totalItems);
  const pathname = usePathname();

  // 🔑 Sync NextAuth session token to cookies
  useAuthToken();

  // Fetch cart when logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserCart());
    }
  }, [isLoggedIn, dispatch]);

  const isActiveLink = (link: string) => pathname === link;

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <nav className="bg-white border-b shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={isLoggedIn ? "/user" : "/"} className="flex items-center gap-4">
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
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#work" },
    { name: "Join Us", href: "#join" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo */}
          <Link href={isLoggedIn ? "/user" : "/"} className="flex items-center gap-4">
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
                    onClick={() => setActiveLink(link.href.replace("#", ""))}
                    className={`relative text-primary/900 hover:text-primary transition 
                      ${activeLink === link.href.replace("#", "")
                        ? "active-link"
                        : ""
                      }`}>
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full">Sign Up</Button>
                </Link>
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
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/user/favorites">
                  <Heart
                    stroke="currentColor"
                    fill={isActiveLink("/user/favorites") ? "currentColor" : "none"}
                    className={`cursor-pointer transition ${isActiveLink("/user/favorites") ? "text-primary" : "opacity-70"
                      }`}
                  />
                </Link>
                <Link href="/user/cart" className="relative">
                  <ShoppingCart
                    stroke="currentColor"
                    fill={isActiveLink("/user/cart") ? "currentColor" : "none"}
                    className={`cursor-pointer transition ${isActiveLink("/user/cart") ? "text-primary" : "opacity-70"
                      }`}
                  />
                  {cartTotalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartTotalItems}
                    </span>
                  )}
                </Link>
                <Link href="/user/notifications">
                  <Bell
                    stroke="currentColor"
                    fill={isActiveLink("/user/notifications") ? "currentColor" : "none"}
                    className={`cursor-pointer transition ${isActiveLink("/user/notifications") ? "text-primary" : "opacity-70"
                      }`}
                  />
                </Link>
                <Link href="/user/profile">
                  <User
                    stroke="currentColor"
                    fill={isActiveLink("/user/profile") ? "currentColor" : "none"}
                    className={`cursor-pointer transition ${isActiveLink("/user/profile") ? "text-primary" : "opacity-70"
                      }`}
                  />
                </Link>
                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push("/");
                    router.refresh();
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition">
                  <LogOut size={20} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
              {/* Mobile Menu Button for logged in users */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-primary">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {!isLoggedIn ? (
              <>
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
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/user"
                  className="block text-primary/900 hover:text-primary transition py-2"
                  onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link
                  href="/favorites"
                  className="block text-primary/900 hover:text-primary transition py-2"
                  onClick={() => setIsOpen(false)}>
                  Favorites
                </Link>
                <Link
                  href="/cart"
                  className="block text-primary/900 hover:text-primary transition py-2"
                  onClick={() => setIsOpen(false)}>
                  Cart
                </Link>
                <Link
                  href="/notifications"
                  className="block text-primary/900 hover:text-primary transition py-2"
                  onClick={() => setIsOpen(false)}>
                  Notifications
                </Link>
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await signOut({ redirect: false });
                    router.push("/");
                    router.refresh();
                  }}
                  className="w-full mt-3 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition py-2">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
