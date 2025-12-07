"use client";
import React from "react";
import Image from "next/image";
import { previousIcon } from "@/assets";
import { useRouter } from "next/navigation";

export default function PrvButton() {
  const router = useRouter();

  return (
    <div className="cursor-pointer">
      <Image
        src={previousIcon}
        width={40}
        height={40}
        alt="Previous page"
        className="transition-transform duration-200 hover:scale-110"
        priority
        onClick={() => router.back()}
      />
    </div>
  );
}
