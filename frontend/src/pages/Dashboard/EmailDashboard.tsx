import { Users, CalendarDays, CalendarCheck, Ban } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMyLeadStatsAPI } from "@/api/dashboard.api";
import { useState, useEffect } from "react";
import { getMyLeadsAPI } from "@/api/lead.api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const EmailDashboard = () => {
  const navigate = useNavigate();

  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [thisMonth, setThisMonth] = useState<number | null>(null);
  const [thisWeek, setThisWeek] = useState<number | null>(null);
  const [duplicatesSkipped, setDuplicatesSkipped] = useState<number | null>(
    null,
  );
  const [recentLeads, setRecentLeads] = useState([]);
  const [chartData, setChartData] = useState([]);

  const stats = [
    {
      label: "Total Leads Submitted",
      value: totalLeads !== null ? totalLeads.toLocaleString() : "-",
      icon: Users,
    },
    {
      label: "This Month",
      value: thisMonth !== null ? thisMonth.toLocaleString() : "—",
      icon: CalendarDays,
    },
    {
      label: "This Week",
      value: thisWeek !== null ? thisWeek.toLocaleString() : "—",
      icon: CalendarCheck,
    },
    {
      label: "Duplicates Skipped",
      value:
        duplicatesSkipped !== null ? duplicatesSkipped.toLocaleString() : "—",
      icon: Ban,
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          getMyLeadStatsAPI(),
          getMyLeadsAPI({ page: 1, limit: 7 }),
        ]);

        if (statsRes.data.success) {
          setTotalLeads(statsRes.data.totalLeads);
          setThisMonth(statsRes.data.thisMonth);
          setThisWeek(statsRes.data.thisWeek);
          setDuplicatesSkipped(statsRes.data.duplicatesSkipped);
        }

        // build last 7 days with 0 fallback for missing days

        const raw = statsRes.data.weeklyData;

        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const key = d.toISOString().split("T")[0]; // "2026-03-01"
          const found = raw.find((r: any) => r._id === key);
          return {
            day: d.toLocaleDateString("en-US", { weekday: "short" }), // "Mon"
            leads: found?.leads ?? 0,
          };
        });

        setChartData(days);

        if (leadsRes.data.success) {
          setRecentLeads(leadsRes.data.leads);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats: ", error);
      }
    };
    fetchStats();
  }, []);

  const AVATAR_COLORS = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500",
  ];

  const getAvatarColor = (name: string) =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <div>
      {/* Stats Row */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Recent Leads */}

        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recent Leads
            </h2>
            <button
              onClick={() => navigate("/my-leads")}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              See All <ArrowRight size={12} />
            </button>
          </div>

          {/* recent leads  table */}

          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left pb-3 font-medium">Name</th>
                  <th className="text-left pb-3 font-medium">Website</th>
                  <th className="text-left pb-3 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead: any) => (
                  <tr
                    key={lead._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/my-leads/${lead._id}`)}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(lead.name)}`}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <span className="font-medium text-foreground">
                          {lead.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{lead.email}</td>
                    <td className="py-3 text-primary">{lead.website}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}

        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-20">
            Submissions This Week
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar
                dataKey="leads"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard */}

      
    </div>
  );
};

export default EmailDashboard;
