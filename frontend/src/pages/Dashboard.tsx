import DashboardLayout from "@/components/DashboardLayout";
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Total Leads", value: "2,847", change: "+12.5%", up: true, icon: Users, color: "bg-crm-info/10 text-crm-info" },
  { label: "Conversions", value: "384", change: "+8.2%", up: true, icon: Target, color: "bg-crm-success/10 text-crm-success" },
  { label: "Revenue", value: "$128.4K", change: "+23.1%", up: true, icon: DollarSign, color: "bg-accent/10 text-accent" },
  { label: "Growth Rate", value: "18.3%", change: "-2.4%", up: false, icon: TrendingUp, color: "bg-crm-warning/10 text-crm-warning" },
];

const recentLeads = [
  { name: "Sarah Johnson", email: "sarah@techcorp.com", status: "Hot", value: "$12,000", date: "2 hours ago" },
  { name: "Michael Chen", email: "mchen@startup.io", status: "Warm", value: "$8,500", date: "5 hours ago" },
  { name: "Emma Williams", email: "emma@designco.com", status: "Cold", value: "$3,200", date: "1 day ago" },
  { name: "James Rodriguez", email: "james@finserv.com", status: "Hot", value: "$25,000", date: "1 day ago" },
  { name: "Aisha Patel", email: "aisha@medtech.io", status: "Warm", value: "$15,800", date: "2 days ago" },
];

const statusColors: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive",
  Warm: "bg-crm-warning/10 text-crm-warning",
  Cold: "bg-crm-info/10 text-crm-info",
};

const pipelineStages = [
  { stage: "Prospecting", count: 124, percent: 35 },
  { stage: "Qualification", count: 89, percent: 25 },
  { stage: "Proposal", count: 67, percent: 19 },
  { stage: "Negotiation", count: 45, percent: 13 },
  { stage: "Closed Won", count: 28, percent: 8 },
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-crm-success" : "text-destructive"}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-card rounded-xl card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-base font-display font-bold text-foreground">Recent Leads</h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Value</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden md:table-cell">Added</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.email} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">{lead.value}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground hidden md:table-cell">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
