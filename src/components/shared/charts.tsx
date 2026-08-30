"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EngagementPoint, ThemeScore, PlatformShare } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "hsl(243 75% 59%)",
  TikTok: "hsl(0 72% 51%)",
  LinkedIn: "hsl(210 80% 50%)",
  "X / Twitter": "hsl(220 12% 45%)",
  Facebook: "hsl(220 60% 50%)",
};

export function EngagementChart({ data }: { data: EngagementPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement this week</CardTitle>
        <p className="text-xs text-muted-foreground">Reach across all connected channels</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">122.2k</span>
          <span className="text-sm font-medium text-success">+18.4%</span>
        </div>
        <div className="mt-4 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(243 75% 59%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(243 75% 59%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "hsl(222 12% 45%)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(222 12% 45%)" }}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(222 20% 90%)",
                  fontSize: 12,
                }}
                formatter={(v) => formatNumber(Number(v))}
              />
              <Area
                type="monotone"
                dataKey="reach"
                stroke="hsl(243 75% 59%)"
                strokeWidth={2}
                fill="url(#reach)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ThemeBars({ data }: { data: ThemeScore[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top content themes</CardTitle>
        <p className="text-xs text-muted-foreground">Performance score (0–100)</p>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="theme"
                tickLine={false}
                axisLine={false}
                width={110}
                tick={{ fontSize: 12, fill: "hsl(222 12% 45%)" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(222 20% 90%)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="hsl(243 75% 59%)" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlatformShareChart({ data }: { data: PlatformShare[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Platform comparison</CardTitle>
        <p className="text-xs text-muted-foreground">Share of total engagement</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="share"
                  nameKey="platform"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(222 20% 90%)",
                    fontSize: 12,
                  }}
                  formatter={(v) => `${v}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex-1 space-y-2">
            {data.map((entry) => (
              <li key={entry.platform} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: PLATFORM_COLORS[entry.platform] }}
                  />
                  {entry.platform}
                </span>
                <span className="font-medium tabular-nums">{entry.share}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
