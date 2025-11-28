import PrvButton from "@/Components/shared/prvButton";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <PrvButton />
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">Medicine</h3>
          </div>
          {/* Search Input */}
          {/* <SearchInput /> */}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h3 className="heading">Find Medicines</h3>
          <p className="font-normal text-[#8E8E8E] text-xl mb-5">
            Search for medicines and health products available near you.
          </p>
          
          {/* Placeholder for results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder Cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-4xl">
                  💊
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicine Name {item}</h3>
                <p className="text-gray-500 text-sm mb-4">Description of the medicine...</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">$10.00</span>
                  <button className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
