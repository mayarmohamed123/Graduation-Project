import Image from "next/image";
import photo from "@/assets/message-square.svg";
import { Textarea } from "../ui/textarea";

export function MessageTextarea() {
  return (
    <div className="relative w-full mb-4">
      <Image
        src={photo}
        alt="Message icon"
        width={18}
        height={18}
        className="absolute left-3 top-3 text-[#B2B2B2]"
      />
      <Textarea
        placeholder="Message"
        rows={6}
        className="pl-10 rounded-xl text-[#B2B2B2] bg-white border-[#D4D4D4] focus-visible:ring-[#2BBBC5]"
      />
    </div>
  );
}
