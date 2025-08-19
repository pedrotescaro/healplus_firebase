import { Stethoscope } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <Stethoscope className="h-7 w-7" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        WoundWise
      </span>
    </div>
  );
}
