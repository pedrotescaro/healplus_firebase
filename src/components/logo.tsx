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
      <span className="text-4xl font-bold tracking-tight text-foreground -ml-1">
        Heal+
      </span>
    </div>
  );
}
