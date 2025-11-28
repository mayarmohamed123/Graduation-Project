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
        width={75}
        height={45}
        alt="Previous page"
        className="transition-transform duration-200 hover:scale-110"
        priority
        style={{ width: "auto", height: "auto" }}
        onClick={() => router.back()}
      />
    </div>
  );
}
