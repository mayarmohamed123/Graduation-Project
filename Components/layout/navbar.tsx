"use client";

import { Menu, X, LogOut } from "lucide-react";
import React, { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "@/hooks/useAuth";

import Image from "next/image";
import Link from "next/link";
import { sehhaLogo } from "@/assets";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, Bell, User } from "lucide-react";
import { fetchUnreadCount } from "@/store/slices/notificationSlice";

function Navbar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const cartTotalItems = useAppSelector((state) => state.cart.totalItems);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const pathname = usePathname();

  // Fetch cart and unread notifications on mount
  useEffect(() => {
    dispatch(fetchUserCart());
    dispatch(fetchUnreadCount("user"));
  }, [dispatch]);

  // Memoize active link checker
  const isActiveLink = useCallback((link: string) => pathname === link, [pathname]);

  // Memoize toggle handler
  const handleToggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Memoize close menu handler
  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className="bg-white border-b shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/user" className="flex items-center gap-4">
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

          {/* Desktop Menu */}
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
            <Link href="/user/notifications" className="relative">
              <Bell
                stroke="currentColor"
                fill={isActiveLink("/user/notifications") ? "currentColor" : "none"}
                className={`cursor-pointer transition ${isActiveLink("/user/notifications") ? "text-primary" : "opacity-70"
                  }`}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in duration-300">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
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
              onClick={logout}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition">
              <LogOut size={20} />
              <span className="hidden lg:inline">Logout</span>
            </button>
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
            <Link
              href="/user"
              className="block text-primary/900 hover:text-primary transition py-2"
              onClick={handleCloseMenu}>
              Dashboard
            </Link>
            <Link
              href="/user/favorites"
              className="block text-primary/900 hover:text-primary transition py-2"
              onClick={handleCloseMenu}>
              Favorites
            </Link>
            <Link
              href="/user/cart"
              className="block text-primary/900 hover:text-primary transition py-2"
              onClick={handleCloseMenu}>
              Cart
            </Link>
            <Link
              href="/user/notifications"
              className="block text-primary/900 hover:text-primary transition py-2"
              onClick={handleCloseMenu}>
              Notifications
            </Link>
            <button
              onClick={() => {
                handleCloseMenu();
                logout();
              }}
              className="w-full mt-3 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition py-2">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Export memoized component to prevent re-renders from parent
export default memo(Navbar);
