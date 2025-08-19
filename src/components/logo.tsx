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
          <linearGradient id="h-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00AEEF" />
            <stop offset="1" stopColor="#0072B5" />
          </linearGradient>
          <linearGradient id="ring-gradient" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00AEEF" />
            <stop offset="1" stopColor="#0072B5" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Ring */}
        <path d="M10 50 C10 20, 90 20, 90 50 C90 80, 10 80, 10 50 Z" stroke="url(#ring-gradient)" strokeWidth="8" fill="none" transform="rotate(-20 50 50)" filter="url(#shadow)" />

        {/* H Letter */}
        <text x="50" y="70" fontFamily="Arial, sans-serif" fontSize="70" fontWeight="bold" fill="url(#h-gradient)" textAnchor="middle" filter="url(#shadow)">H</text>

        {/* Band-aid */}
        <g transform="translate(65, 5) scale(0.4)">
            <path d="M50,10 C65,10 75,20 75,35 L75,65 C75,80 65,90 50,90 C35,90 25,80 25,65 L25,35 C25,20 35,10 50,10 Z" fill="#00AEEF" stroke="#FFFFFF" strokeWidth="4"/>
            <rect x="40" y="30" width="20" height="40" fill="#FFFFFF" rx="5" />
            <circle cx="45" cy="40" r="2" fill="#00AEEF" />
            <circle cx="55" cy="40" r="2" fill="#00AEEF" />
            <circle cx="45" cy="50" r="2" fill="#00AEEF" />
            <circle cx="55" cy="50" r="2" fill="#00AEEF" />
            <circle cx="45" cy="60" r="2" fill="#00AEEF" />
            <circle cx="55" cy="60" r="2" fill="#00AEEF" />
        </g>
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Heal+
      </span>
    </div>
  );
}
