import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="https://i.imgur.com/HJ8HDJs.png"
        alt="Heal+ Logo"
        width={56}
        height={56}
        className="h-14 w-14"
      />
      <span className="text-4xl font-bold tracking-tight text-foreground">
        Heal+
      </span>
    </div>
  );
}
