
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslation } from "@/contexts/app-provider";
import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts"

interface ActivitySummaryChartProps {
  data: {
    name: string;
    label: string;
    value: number;
  }[];
}

export function ActivitySummaryChart({ data }: ActivitySummaryChartProps) {
  const { t } = useTranslation();

  const chartConfig = useMemo(() => ({
    completedForms: {
      label: t.activityChartCompletedForms,
      color: "hsl(var(--chart-1))",
    },
    generatedReports: {
      label: t.activityChartGeneratedReports,
      color: "hsl(var(--chart-2))",
    },
    comparisons: {
      label: t.activityChartComparisons,
      color: "hsl(var(--chart-3))",
    },
  }), [t]) satisfies ChartConfig;
  

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-square">
        <PieChart>
            <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
            />
            <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="60%"
            strokeWidth={5}
            >
                {data.map((entry, index) => {
                    const configEntry = chartConfig[entry.name as keyof typeof chartConfig];
                    return (
                        <Cell key={`cell-${index}`} fill={configEntry?.color} />
                    )
                })}
            </Pie>
            <ChartLegend
            content={<ChartLegendContent nameKey="label" />}
            className="-mt-4"
            />
        </PieChart>
    </ChartContainer>
  )
}
