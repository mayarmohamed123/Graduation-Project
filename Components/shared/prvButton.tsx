"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import prev from "@/assets/pre.svg";
import { useRouter } from "next/navigation";

export default function PrvButton() {
  const router = useRouter();

  return (
    <div className="cursor-pointer">
      <Image
        src={prev}
        width={75}
        height={45}
        alt="Previous page"
        className="transition-transform duration-200 hover:scale-110"
        priority
        onClick={() => router.back()}
      />
    </div>
  );
}
