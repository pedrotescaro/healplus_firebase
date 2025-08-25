
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

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col items-center justify-center gap-2 pt-6">
      {payload.map((entry: any, index: number) => {
        // 'entry.payload.payload' is where the original data object for the pie slice is
        const { label, value, fill } = entry.payload.payload;
        return (
          <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: fill }} />
            <span>{label}:</span>
            <span className="font-bold">{value}</span>
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
            legendType="square"
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <foreignObject width="100%" height="100%">
              {/* @ts-ignore */}
              <CustomLegend payload={chartData.map(d => ({ payload: { payload: d }}))} />
            </foreignObject>
        </PieChart>
    </ChartContainer>
  )
}
