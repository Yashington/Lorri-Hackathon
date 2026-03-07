"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface VendorPerformanceData {
  vendor_name: string;
  avg_match_rate: number;
  recent_audits: number;
  risk_incidents: number;
}

interface VendorPerformanceChartProps {
  data: VendorPerformanceData[];
}

export default function VendorPerformanceChart({
  data,
}: VendorPerformanceChartProps) {
  const chartData = data.slice(0, 8).map((vendor) => ({
    name: vendor.vendor_name.substring(0, 12),
    "Match Rate": vendor.avg_match_rate,
    "Risk Incidents": vendor.risk_incidents * 10, // Scale for visibility
  }));

  return (
    <Card className="border-border/50 shadow-lg lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Top Vendor Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="Match Rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Risk Incidents" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
