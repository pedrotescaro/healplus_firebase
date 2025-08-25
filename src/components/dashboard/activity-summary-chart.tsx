
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Pie, PieChart, Cell } from "recharts"

interface ActivitySummaryChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const chartConfig = {
  "Fichas Concluídas": {
    label: "Fichas Concluídas",
    color: "hsl(var(--chart-1))",
  },
  "Relatórios Gerados": {
    label: "Relatórios Gerados",
    color: "hsl(var(--chart-2))",
  },
  "Comparações Feitas": {
    label: "Comparações Feitas",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ActivitySummaryChart({ data }: ActivitySummaryChartProps) {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

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
            nameKey="name"
            innerRadius="60%"
            strokeWidth={5}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                ))}
            </Pie>
            <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-mt-4"
            />
        </PieChart>
    </ChartContainer>
  )
}
