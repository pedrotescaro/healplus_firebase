import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="https://i.imgur.com/HJ8HDJs.png"
        alt="Heal+ Logo"
        width={60}
        height={60}
        className="h-16 w-16"
      />
      <span className="text-5xl font-bold tracking-tight text-foreground -ml-2">
        Heal+
      </span>
    </div>
  );
}
