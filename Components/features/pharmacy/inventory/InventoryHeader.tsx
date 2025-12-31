"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface InventoryHeaderProps {
  onAddProduct?: () => void;
}

export const InventoryHeader = ({ onAddProduct }: InventoryHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Inventory Management</h1>
        <p className="text-muted-foreground text-sm font-medium">Monitor stocks and manage your pharmacy products.</p>
      </div>
      <Button 
        onClick={onAddProduct}
        className="bg-[#2BBBC5] hover:bg-[#25a0a9] rounded-2xl px-6 py-3 h-auto shadow-lg shadow-teal-100/50 transition-all active:scale-95"
      >
        <Plus className="w-5 h-5 mr-2" /> Add New Product
      </Button>
    </div>
  );
};
