import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Clock, CalendarCheck, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { getBdeDashboardStatsAPI, getFollowUpsAPI } from "@/api/dashboard.api";

const statusColors: Record<string, string> = {
  RNR: "bg-gray-100 text-gray-700",
  Answered: "bg-blue-100 text-blue-700",
  "Follow Up": "bg-orange-100 text-orange-700",
  Interested: "bg-green-100 text-green-700",
  "Not Interested": "bg-red-100 text-red-700",
  DNS: "bg-yellow-100 text-yellow-700",
};

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-red-500",
];

const pipelineData = [
  {
    id: "1",
    name: "Rajesh Kumar",
    website: "technovas.in",
    status: "Interested",
    updated: "2 hours ago",
  },
  {
    id: "2",
    name: "Priya Sharma",
    website: "designhub.co",
    status: "Follow Up",
    updated: "5 hours ago",
  },
  {
    id: "3",
    name: "Amit Patel",
    website: "cloudnine.io",
    status: "Answered",
    updated: "1 day ago",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    website: "freshmart.com",
    status: "RNR",
    updated: "1 day ago",
  },
  {
    id: "5",
    name: "Vikram Singh",
    website: "buildfast.dev",
    status: "Not Interested",
    updated: "2 days ago",
  },
  {
    id: "6",
    name: "Neha Gupta",
    website: "payeasy.in",
    status: "DNS",
    updated: "3 days ago",
  },
  {
    id: "7",
    name: "Arjun Mehta",
    website: "greenleaf.org",
    status: "Interested",
    updated: "3 days ago",
  },
];

const chartData = [
  { status: "RNR", count: 32 },
  { status: "Answered", count: 28 },
  { status: "Follow Up", count: 24 },
  { status: "Interested", count: 19 },
  { status: "Not Interested", count: 15 },
  { status: "DNS", count: 24 },
];

const followUps = [
  {
    id: "1",
    name: "Rajesh Kumar",
    company: "technovas.in",
    date: "Mar 4, 2026 10:30 AM",
    status: "Interested",
    type: "overdue",
  },
  {
    id: "2",
    name: "Priya Sharma",
    company: "designhub.co",
    date: "Mar 6, 2026 2:00 PM",
    status: "Follow Up",
    type: "today",
  },
  {
    id: "3",
    name: "Amit Patel",
    company: "cloudnine.io",
    date: "Mar 8, 2026 11:00 AM",
    status: "Answered",
    type: "upcoming",
  },
];

const borderByType: Record<string, string> = {
  overdue: "border-l-4 border-l-red-500",
  today: "border-l-4 border-l-orange-500",
  upcoming: "border-l-4 border-l-blue-500",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const BdeDashboard = () => {
  const [totalAssigned, setTotalAssigned] = useState<number | null>(null);
  const [followUpsTotal, setFollowUpsTotal] = useState<number | null>(null);

  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Assigned Leads",
      value: totalAssigned !== null ? totalAssigned : "—",
      icon: Users,
      color: "",
    },
    {
      label: "Follow-ups Due",
      value: followUpsTotal !== null ? followUpsTotal : "—",
      icon: Clock,
      color:
        followUpsTotal && followUpsTotal > 0
          ? "text-orange-500"
          : "text-muted-foreground",
    },
    {
      label: "Meetings Scheduled",
      value: 5,
      icon: CalendarCheck,
      color: "text-violet-500",
    },
    {
      label: "Converted Leads",
      value: 23,
      icon: TrendingUp,
      color: "text-green-500",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, followUpsRes] = await Promise.all([
          getBdeDashboardStatsAPI(),
          getFollowUpsAPI(),
        ]);

        if (statsRes.data.success) {
          setTotalAssigned(statsRes.data.totalAssigned);
        }
        if (followUpsRes.data.success) {
          setFollowUpsTotal(followUpsRes.data.total);
        }
      } catch (error) {
        console.error("BDE stats error:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="space-y-6">

        {/* Stats Row */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className={`bg-card border border-border rounded-xl p-5 ${s.label === "Follow-ups Due" ? "cursor-pointer hover:border-orange-300 transition-colors" : ""}`}
              onClick={() => s.label === "Follow-ups Due" ? navigate("/dashboard/follow-ups") : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {s.value}
                  </p>
                </div>
                <s.icon
                  className={`h-8 w-8 ${s.color || "text-muted-foreground"}`}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Pipeline */}
          <Card className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Pipeline
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/my-pipeline")}
              >
                See All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineData.map((lead, i) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/my-pipeline/${lead.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${avatarColors[i % avatarColors.length]}`}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <span className="font-medium text-foreground">
                          {lead.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.website}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[lead.status]}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.updated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pipeline Health */}
          <Card className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Pipeline Health
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
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
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill="hsl(var(--primary))"
                      opacity={0.7 + index * 0.05}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Upcoming Follow-ups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Follow-ups
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/follow-ups")}
            >
              See All Follow-ups
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {followUps.map((fu) => (
              <Card
                key={fu.id}
                className={`bg-card border border-border rounded-xl p-5 ${borderByType[fu.type]}`}
              >
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">{fu.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {fu.company}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{fu.date}</p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={statusColors[fu.status]}
                    >
                      {fu.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/my-pipeline/${fu.id}`)}
                    >
                      View Lead
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BdeDashboard;
