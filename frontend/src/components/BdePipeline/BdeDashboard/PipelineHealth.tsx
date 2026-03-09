import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PipelineHealthItem } from "@/types/lead";

const PipelineHealth = ({ data }: { data: PipelineHealthItem[] }) => (
  <Card className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
    <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline Health</h2>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis
          dataKey="status"
          type="category"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
          {data.map((_, index) => (
            <Cell key={index} fill="hsl(var(--primary))" opacity={0.7 + index * 0.05} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default PipelineHealth;