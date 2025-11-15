import Image from "next/image";
import { Input } from "../ui/input";
import Photo from "@/assets/Email Icon.svg";

export default function EmailInput() {
  return (
    <div className="relative w-full mb-4">
      <Image
        src={Photo}
        alt="Email icon"
        width={18}
        height={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B2B2B2]"
      />
      <Input
        type="email"
        placeholder="Email"
        className="pl-10 rounded-xl text-[#B2B2B2] bg-white border-[#D4D4D4] focus-visible:ring-[#2BBBC5]"
      />
    </div>
  );
}
