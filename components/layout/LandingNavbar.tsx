"use client";

import { Menu, X } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

import { Button } from "../ui";
import Image from "next/image";
import Link from "next/link";
import { healingLogo } from "@/assets";

// Memoized nav link component to prevent unnecessary re-renders
const NavLink = memo(function NavLink({
  href,
  name,
  onClick,
  isActive
}: {
  href: string;
  name: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative py-2 text-sm font-medium transition-colors duration-300 ${isActive ? "text-primary" : "text-gray-600 hover:text-primary"
        }`}
    >
      {name}
      {/* Animated Underline */}
      <span
        className={`absolute bottom-0 left-0 h-[3px] w-full transform transition-all duration-300 origin-left ${isActive
          ? "scale-x-100 opacity-100"
          : "scale-x-0 opacity-0"
          }`}
        style={{
          background: "linear-gradient(90deg, #2BBBC5 0%, #1a9ba3 100%)",
          borderRadius: "2px"
        }}
      />
    </Link>
  );
});

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  // Memoize nav links to prevent recreation on every render
  const navLinks = useMemo(() => [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "How It Works", href: "#work", id: "work" },
    { name: "Join Us", href: "#join", id: "join" },
    { name: "Contact", href: "#contact", id: "contact" },
  ], []);

  // Track scroll position to update active section using IntersectionObserver for better performance
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Adjust to trigger when section is in the upper part of the viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  // Memoize toggle handler
  const handleToggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Memoize close menu handler
  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src={healingLogo}
              alt="Healing Logo"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="text-2xl font-semibold text-primary">Healing</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                name={link.name}
                onClick={handleCloseMenu}
                isActive={activeSection === link.id}
              />
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
              onClick={handleToggleMenu}
              className="text-gray-700 hover:text-primary">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block py-2 transition-colors duration-200 ${activeSection === link.id
                  ? "text-primary font-bold border-l-4 pl-2"
                  : "text-gray-600 pl-3"
                  }`}
                style={activeSection === link.id ? { borderColor: "#2BBBC5" } : {}}
                onClick={handleCloseMenu}>
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col mt-3 space-y-2">
              <Link href="/login" onClick={handleCloseMenu}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={handleCloseMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Export memoized component to prevent re-renders from parent
export default memo(LandingNavbar);
