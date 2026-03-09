
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, CalendarCheck, TrendingUp, FileStack } from "lucide-react";
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
import { getSuperAdminDashboardStatsAPI } from "@/api/dashboard.api";
import { Button } from "@/components/ui/button";
import {
  RecentLead,
  StatusDistributionItem,
  TeamPerformanceItem,
} from "@/types/lead";

// --- helpers ---
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-red-500",
];

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const statusColors: Record<string, string> = {
  RNR: "bg-gray-100 text-gray-700",
  Answered: "bg-blue-100 text-blue-700",
  "Follow Up": "bg-orange-100 text-orange-700",
  Interested: "bg-green-100 text-green-700",
  Converted: "bg-green-200 text-green-800",
  "Not Interested": "bg-red-100 text-red-700",
  DNS: "bg-yellow-100 text-yellow-700",
  Lost: "bg-red-200 text-red-800",
  Trash: "bg-slate-100 text-slate-500",
};

const BAR_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

// --- main page ---

const SuperAdminDashboard = () => {
  
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [assignedLeads, setAssignedLeads] = useState<number | null>(null);
  const [unassignedLeads, setUnassignedLeads] = useState<number | null>(null);

  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [bdeCount, setBdeCount] = useState<number | null>(null);
  const [emailCount, setEmailCount] = useState<number | null>(null);
  const [adminCount, setAdminCount] = useState<number | null>(null);

  const [meetingsThisMonth, setMeetingsThisMonth] = useState<number | null>(
    null,
  );
  const [convertedThisMonth, setConvertedThisMonth] = useState<number | null>(
    null,
  );
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformanceItem[]>(
    [],
  );
  const [statusDistribution, setStatusDistribution] = useState<
    StatusDistributionItem[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getSuperAdminDashboardStatsAPI();
        if (res.data.success) {
          setTotalLeads(res.data.totalLeads);
          setAssignedLeads(res.data.assignedLeads);
          setUnassignedLeads(res.data.unassignedLeads);

          setTotalEmployees(res.data.totalEmployees);
          setBdeCount(res.data.bdeCount);
          setEmailCount(res.data.emailCount);
          setAdminCount(res.data.adminCount);
          setMeetingsThisMonth(res.data.meetingsThisMonth);
          setConvertedThisMonth(res.data.convertedThisMonth);
          setRecentLeads(res.data.recentLeads);
          setTeamPerformance(res.data.teamPerformance);
          setStatusDistribution(res.data.statusDistribution);
        }
      } catch (error) {
        console.error("SuperAdmin stats error:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="space-y-6">
        {/* Stats Row */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate("/all-leads")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {totalLeads ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Assigned: {assignedLeads ?? "—"} &nbsp;|&nbsp; Unassigned:{" "}
                  {unassignedLeads ?? "—"}
                </p>
              </div>
              <FileStack className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate("/manage-employees")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {totalEmployees ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Admin: {adminCount ?? "—"} &nbsp;|&nbsp; BDE:{" "}
                  {bdeCount ?? "—"} &nbsp;|&nbsp; Email: {emailCount ?? "—"}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-violet-300 transition-colors"
            onClick={() => navigate("/meetings")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Meetings This Month
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {meetingsThisMonth ?? "—"}
                </p>
              </div>
              <CalendarCheck className="h-8 w-8 text-violet-500" />
            </div>
          </Card>

          <Card className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Converted This Month
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {convertedThisMonth ?? "—"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Main Two-Column */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Leads Table */}

          <Card className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Leads
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/all-leads")}
              >
                See All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow
                    key={lead._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/all-leads/${lead._id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(lead.name)}`}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <span className="font-medium text-foreground text-sm">
                          {lead.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {lead.website}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {lead.assignedTo?.name ?? "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[lead.status]}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Team Performance */}

          <Card className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Team Performance
            </h2>
            <p className="text-xs text-muted-foreground mb-32">
              Converted leads per BDE — all time
            </p>
            {teamPerformance.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-4">
                No conversions yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={teamPerformance}
                  layout="vertical"
                  margin={{ left: 10, top: 8 }}
                >
                  <XAxis
                    type="number"
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="converted" radius={[0, 4, 4, 0]} barSize={18}>
                    {teamPerformance.map((_, index) => (
                      <Cell
                        key={index}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Lead Status Distribution */}

        <Card className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Lead Status Distribution
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Key statuses across all leads
          </p>
          {statusDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={statusDistribution}
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
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={22}>
                  {statusDistribution.map((_, index) => (
                    <Cell
                      key={index}
                      fill="hsl(var(--primary))"
                      opacity={0.6 + index * 0.15}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
