
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslation } from "@/contexts/app-provider";
import { useMemo } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts"

interface ActivitySummaryChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

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
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-square">
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
            <ChartLegend 
              layout="vertical"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 24 }}
            />
        </PieChart>
    </ChartContainer>
  )
}
