
"use client";

import { TISSUE_TYPES, TissueType, TissueName } from "@/lib/tissue-types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WoundBedProgressProps {
  data: {
    name: TissueName;
    value: number;
  }[];
}

export function WoundBedProgress({ data }: WoundBedProgressProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <TooltipProvider>
        <div className="flex h-8 w-full overflow-hidden rounded-md bg-muted text-xs font-semibold text-white">
          {data.map((item) => {
            const tissueInfo = TISSUE_TYPES[item.name];
            if (!tissueInfo || item.value <= 0) return null;
            return (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className="flex h-full items-center justify-center transition-all duration-300 overflow-hidden"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: tissueInfo.color,
                    }}
                  >
                    {item.value >= 15 && (
                       <div className="truncate px-1">
                          {tissueInfo.label} {item.value}%
                       </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`${tissueInfo.label}: ${item.value}%`}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {data.map((item) => {
          const tissueInfo = TISSUE_TYPES[item.name];
           if (!tissueInfo || item.value <= 0) return null;
          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tissueInfo.color }}
              />
              <span>{tissueInfo.label}</span>
              <span className="text-muted-foreground">{`(${item.value}%)`}</span>
            </div>
          );
        })}
      </div>
      {total > 100 && (
        <p className="mt-2 text-center text-xs font-semibold text-destructive">
          Atenção: A soma dos percentuais ({total}%) ultrapassou 100%.
        </p>
      )}
    </div>
  );
}
