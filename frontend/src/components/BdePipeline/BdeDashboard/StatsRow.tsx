import { Card } from "@/components/ui/card";
import { Users, Clock, CalendarCheck, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatsRowProps {
  totalAssigned: number | null;
  followUpsTotal: number | null;
  meetingsScheduled: number | null;
  convertedLeads: number | null;
}

const StatsRow = ({ totalAssigned, followUpsTotal, meetingsScheduled, convertedLeads }: StatsRowProps) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Assigned Leads",
      value: totalAssigned ?? "0",
      icon: Users,
      color: "",
      hover: "hover:border-primary/30",
      onClick: () => navigate("/my-pipeline"),
    },
    {
      label: "Follow-ups Due",
      value: followUpsTotal ?? "0",
      icon: Clock,
      color: followUpsTotal && followUpsTotal > 0 ? "text-orange-500" : "text-muted-foreground",
      hover: "hover:border-orange-300",
      onClick: () => navigate("/dashboard/follow-ups"),
    },
    {
      label: "Meetings Scheduled",
      value: meetingsScheduled ?? "0",
      icon: CalendarCheck,
      color: "text-violet-500",
      hover: "hover:border-violet-300",
      onClick: () => navigate("/meetings"),
    },
    {
      label: "Converted Leads",
      value: convertedLeads ?? "0",
      icon: TrendingUp,
      color: "text-green-500",
      hover: "hover:border-green-300",
      onClick: () => navigate("/dashboard/converted-leads"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className={`bg-card border border-border rounded-xl p-5 transition-colors ${s.onClick ? `cursor-pointer ${s.hover}` : ""}`}
          onClick={s.onClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            </div>
            <s.icon className={`h-8 w-8 ${s.color || "text-muted-foreground"}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsRow;