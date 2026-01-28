"use client";
import Image from "next/image";
import React, { useState } from "react";
import { vector } from "@/assets";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ onSearch, placeholder = "Search for doctors, pharmacies, or blood donors", className = "" }: SearchInputProps) {
  const [query, setQuery] = useState<string>("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  return (
    <form
      onSubmit={handleSearch}
      className={`flex items-center justify-center w-full ${className}`}>
      <div className="relative flex w-full border border-[#2BBBC5] rounded-full overflow-hidden shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 outline-none text-gray-700"
        />
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <Image
            className="cursor-pointer"
            src={vector}
            alt="search icon"
            width={20}
            height={20}
          />
        </div>
      </div>
    </form>
  );
}
