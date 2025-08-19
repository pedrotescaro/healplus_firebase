import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="https://i.imgur.com/HJ8HDJs.png"
        alt="Heal+ Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Heal+
      </span>
    </div>
  );
}
