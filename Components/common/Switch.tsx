"use client";

import React from "react";
import { SwitchProps } from "@/types/favorites";

export default function Switch({ tabs, activeTab, onTabChange }: SwitchProps) {
    return (
        <div className="inline-flex bg-gray-100 rounded-full p-1 w-full md:w-auto">
            {tabs.map((tab) => (
                <button
                type="button"
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
            flex-1 md:flex-none px-8 py-2.5 rounded-full font-medium text-sm
            transition-all duration-300 ease-in-out
            ${activeTab === tab.id
                            ? "bg-primary text-white shadow-md"
                            : "bg-transparent text-gray-700 hover:text-gray-900"
                        }
          `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
