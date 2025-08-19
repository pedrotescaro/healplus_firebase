import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="h-gradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#56CCF2" />
            <stop offset="1" stopColor="#2F80ED" />
          </linearGradient>
        </defs>
        <g>
          {/* H Letter */}
          <rect x="10" y="10" width="22" height="80" rx="5" fill="url(#h-gradient)" />
          <rect x="68" y="10" width="22" height="80" rx="5" fill="#2F80ED" />
          <rect x="22" y="39" width="56" height="22" fill="#43A4F0" />

          {/* Plus sign */}
          <g transform="translate(65, 5)">
            <circle cx="20" cy="20" r="15" fill="#2F80ED" stroke="white" strokeWidth="2" />
            <path d="M20 12 V 28 M 12 20 H 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Heal+
      </span>
    </div>
  );
}
