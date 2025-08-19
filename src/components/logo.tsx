import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="https://i.imgur.com/HJ8HDJs.png"
        alt="Heal+ Logo"
        width={40}
        height={40}
        className="h-10 w-10"
      />
      <span className="text-2xl font-bold tracking-tight text-foreground">
        Heal+
      </span>
    </div>
  );
}
