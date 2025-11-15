import { SearchInput } from "@/Components";
import PrvButton from "@/Components/shared/prvButton";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex">
          <div className="flex justify-between">
            <PrvButton />
            <h3 className="text-4xl font-semibold text-gray-900">Medicine</h3>
          </div>
          {/* Search Input */}
          <SearchInput />
        </div>
      </div>
    </div>
  );
}
