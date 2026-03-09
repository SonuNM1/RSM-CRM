import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CalendarCheck, TrendingUp, FileStack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// --- mock data ---
const recentLeads = [
  { id: "1", name: "Rajesh Kumar", website: "technovas.in", email: "rajesh@technovas.in", status: "Interested", submittedBy: "Ananya Singh", date: "Mar 8, 2026" },
  { id: "2", name: "Priya Sharma", website: "designhub.co", email: "priya@designhub.co", status: "Follow Up", submittedBy: "Rahul Mehta", date: "Mar 7, 2026" },
  { id: "3", name: "Amit Patel", website: "cloudnine.io", email: "amit@cloudnine.io", status: "Converted", submittedBy: "Ananya Singh", date: "Mar 6, 2026" },
  { id: "4", name: "Sneha Reddy", website: "freshmart.com", email: "sneha@freshmart.com", status: "RNR", submittedBy: "Rahul Mehta", date: "Mar 5, 2026" },
  { id: "5", name: "Vikram Singh", website: "buildfast.dev", email: "vikram@buildfast.dev", status: "Not Interested", submittedBy: "Ananya Singh", date: "Mar 4, 2026" },
  { id: "6", name: "Neha Gupta", website: "payeasy.in", email: "neha@payeasy.in", status: "DNS", submittedBy: "Rahul Mehta", date: "Mar 3, 2026" },
  { id: "7", name: "Arjun Mehta", website: "greenleaf.org", email: "arjun@greenleaf.org", status: "Interested", submittedBy: "Ananya Singh", date: "Mar 2, 2026" },
];

const teamPerformance = [
  { name: "Rohil", converted: 18 },
  { name: "Sneha", converted: 14 },
  { name: "Arjun", converted: 11 },
  { name: "Priya", converted: 8 },
  { name: "Vikram", converted: 5 },
];

const statusDistribution = [
  { status: "Interested", count: 42 },
  { status: "Follow Up", count: 31 },
  { status: "Converted", count: 24 },
];

// --- helpers ---
const AVATAR_COLORS = ["bg-blue-500","bg-green-500","bg-violet-500","bg-orange-500","bg-pink-500","bg-teal-500","bg-red-500"];
const getAvatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

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

const BAR_COLORS = ["#6366f1","#3b82f6","#10b981","#f59e0b","#ec4899"];

// --- main page ---
const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground mt-1">284</p>
              </div>
              <FileStack className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-foreground mt-1">12</p>
                <p className="text-xs text-muted-foreground mt-1">
                  BDE: 5 &nbsp;|&nbsp; Email: 4
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Meetings This Month</p>
                <p className="text-2xl font-bold text-foreground mt-1">18</p>
              </div>
              <CalendarCheck className="h-8 w-8 text-violet-500" />
            </div>
          </Card>

          <Card className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Converted This Month</p>
                <p className="text-2xl font-bold text-foreground mt-1">9</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Main Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Recent Leads Table */}
          <Card className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Leads</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/all-leads/${lead.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(lead.name)}`}>
                          {getInitials(lead.name)}
                        </div>
                        <span className="font-medium text-foreground text-sm">{lead.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{lead.website}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{lead.submittedBy}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[lead.status]}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{lead.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Team Performance */}
          <Card className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Team Performance</h2>
            <p className="text-xs text-muted-foreground mb-4">Converted leads per BDE — all time</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={teamPerformance} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
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
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Lead Status Distribution */}
        <Card className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-1">Lead Status Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Key statuses across all leads</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={statusDistribution} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
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
                  <Cell key={index} fill="hsl(var(--primary))" opacity={0.6 + index * 0.15} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;