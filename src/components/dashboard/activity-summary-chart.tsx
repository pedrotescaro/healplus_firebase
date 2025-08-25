
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslation } from "@/contexts/app-provider";
import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts"

interface ActivitySummaryChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const CustomLegend = ({ payload }: { payload: any[] }) => {
  return (
    <ul className="flex flex-col items-center justify-center gap-2 pt-4">
      {payload.map((entry, index) => {
        return (
          <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span>{entry.label}:</span>
            <span className="font-bold">{entry.value}</span>
          </li>
        );
      })}
    </ul>
  );
};


export function ActivitySummaryChart({ data }: ActivitySummaryChartProps) {
  const { t } = useTranslation();

  const chartConfig = useMemo(() => ({
    completedForms: {
      label: t.activityChartCompletedFormsBilingual,
      color: "hsl(var(--chart-1))",
    },
    generatedReports: {
      label: t.activityChartGeneratedReportsBilingual,
      color: "hsl(var(--chart-2))",
    },
    comparisons: {
      label: t.activityChartComparisonsBilingual,
      color: "hsl(var(--chart-3))",
    },
  }), [t]) satisfies ChartConfig;
  
  const chartData = data.map(item => ({
    ...item,
    label: chartConfig[item.name as keyof typeof chartConfig]?.label,
    fill: chartConfig[item.name as keyof typeof chartConfig]?.color,
  }));

  return (
    <div className="flex flex-col items-center">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-[250px] aspect-square">
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius="60%"
                strokeWidth={5}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
        <CustomLegend payload={chartData} />
    </div>
  )
}
