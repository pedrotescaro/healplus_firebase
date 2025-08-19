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
            <stop stopColor="#6DD5FA" />
            <stop offset="1" stopColor="#2980B9" />
          </linearGradient>
          <linearGradient id="ring-gradient" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6DD5FA" />
            <stop offset="1" stopColor="#2980B9" />
          </linearGradient>
           <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>
        
        <g style={{ filter: 'url(#shadow)' }}>
          <text 
            x="50" 
            y="75" 
            fontFamily="Arial, sans-serif" 
            fontSize="80" 
            fontWeight="bold" 
            fill="url(#h-gradient)" 
            textAnchor="middle" 
            style={{ transform: 'skewX(-10deg)' }}
          >
            H
          </text>
          
          <path d="M10 50 C 10 20, 90 20, 90 50 C 90 80, 10 80, 10 50 Z" stroke="url(#ring-gradient)" strokeWidth="8" fill="none" transform="rotate(-20 50 50)" />
        </g>

        <g transform="translate(68, 8) scale(0.35)">
            <path d="M50,10 C65,10 75,20 75,35 L75,65 C75,80 65,90 50,90 C35,90 25,80 25,65 L25,35 C25,20 35,10 50,10 Z" fill="#E0F7FA" stroke="#B2EBF2" strokeWidth="4"/>
            <rect x="42" y="35" width="16" height="30" fill="#B2EBF2" rx="3" />
             <path d="M42 42.5 h16 M42 50 h16 M42 57.5 h16" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Heal+
      </span>
    </div>
  );
}
