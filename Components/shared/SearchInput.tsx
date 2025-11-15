"use client";
import Image from "next/image";
import React, { useState } from "react";
import vector from "@/assets/Vector.svg";

export default function SearchInput() {
  const [query, setQuery] = useState<string>("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center mb-12 w-full">
      <div className="relative flex w-full max-w-4xl border border-[#2BBBC5] rounded-full overflow-hidden shadow-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for doctors, pharmacies, or blood donors"
          className="w-full px-4 py-2 outline-none text-gray-700"
        />
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <Image src={vector} alt="search icon" width={20} height={20} />
        </div>
      </div>
    </form>
  );
}
