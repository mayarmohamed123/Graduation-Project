"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  ShoppingCart,
  Calendar,
  CreditCard,
  Lock,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: "Sara Mohamed",
    email: "SaraMohamed@gmail.com",
    phone: "01123456789",
    address: "129, El-Nasr Street, Cairo, Egypt",
    image: "/profile-1.jpg",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved data:", user);
    // هنا يمكنك إرسال البيانات إلى API
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-2">
            <Image
              src={user.image}
              alt="Profile"
              className="rounded-full"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.address.split(",")[0]}</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li className="flex items-center gap-2 text-white bg-teal-500 p-2 rounded-md">
              <User size={18} /> Personal information
            </li>
            <li className="flex items-center gap-2 text-gray-700 hover:text-teal-500 cursor-pointer">
              <ShoppingCart size={18} /> Orders
            </li>
            <li className="flex items-center gap-2 text-gray-700 hover:text-teal-500 cursor-pointer">
              <Calendar size={18} /> Appointments
            </li>
            <li className="flex items-center gap-2 text-gray-700 hover:text-teal-500 cursor-pointer">
              <CreditCard size={18} /> Wallets
            </li>
            <li className="flex items-center gap-2 text-gray-700 hover:text-teal-500 cursor-pointer">
              <Lock size={18} /> Password management
            </li>
            <li className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer mt-6">
              <LogOut size={18} /> Log out
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold mb-6">Personal information</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-6 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition">
          Save Changes
        </button>
      </main>
    </div>
  );
}
