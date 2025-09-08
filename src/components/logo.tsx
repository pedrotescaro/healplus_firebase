import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="https://i.imgur.com/HJ8HDJs.png"
        alt="Heal+ Logo"
        width={100}
        height={100}
        className="h-20 w-20"
      />
      <span className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent -ml-1">
        Heal
      </span>
    </div>
  );
}
