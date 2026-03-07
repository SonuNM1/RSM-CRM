import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    .map((w) => w[0].toUpperCase())
    .join("");

// hardcoded for now
const overdueLeads = [
  {
    id: "1",
    name: "Rajesh Kumar",
    website: "technovas.in",
    followUpDate: "Mar 4, 2026 10:30 AM",
  },
  {
    id: "2",
    name: "Sneha Reddy",
    website: "freshmart.com",
    followUpDate: "Mar 5, 2026 3:00 PM",
  },
];
const dueTodayLeads = [
  {
    id: "3",
    name: "Priya Sharma",
    website: "designhub.co",
    followUpDate: "Mar 7, 2026 2:00 PM",
  },
];
const upcomingLeads = [
  {
    id: "4",
    name: "Amit Patel",
    website: "cloudnine.io",
    followUpDate: "Mar 9, 2026 11:00 AM",
  },
  {
    id: "5",
    name: "Vikram Singh",
    website: "buildfast.dev",
    followUpDate: "Mar 10, 2026 4:00 PM",
  },
  {
    id: "6",
    name: "Arjun Mehta",
    website: "greenleaf.org",
    followUpDate: "Mar 12, 2026 10:00 AM",
  },
];

interface FollowUpLead {
  id: string;
  name: string;
  website: string;
  followUpDate: string;
}

interface SectionProps {
  title: string;
  dotColor: string;
  borderColor: string;
  leads: FollowUpLead[];
}

const FollowUpSection = ({
  title,
  dotColor,
  borderColor,
  leads,
}: SectionProps) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        <h2 className="text-base font-semibold text-foreground">
          {title}{" "}
          <span className="text-muted-foreground font-normal">
            ({leads.length})
          </span>
        </h2>
      </div>
      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <Card
              key={lead.id}
              className={`bg-card border border-border rounded-xl p-5 ${borderColor}`}
            >
              <div className="space-y-4">
                {/* Top — avatar + name + website */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(lead.name)}`}
                  >
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {lead.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.website}
                    </p>
                  </div>
                </div>
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span>{lead.followUpDate}</span>
                </div>
                {/* Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/my-pipeline/${lead.id}`)}
                >
                  View Lead
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const FollowUps = () => {
  const total = overdueLeads.length + dueTodayLeads.length + upcomingLeads.length;
  const navigate = useNavigate() ; 

  return (
    <DashboardLayout title="My Follow-ups">
      <div className="space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
            {total} total
          </Badge>
        </div>

        {/* Sections */}
        <FollowUpSection
          title="Overdue"
          dotColor="bg-red-500"
          borderColor="border-l-4 border-l-red-500"
          leads={overdueLeads}
        />
        <FollowUpSection
          title="Due Today"
          dotColor="bg-orange-500"
          borderColor="border-l-4 border-l-orange-500"
          leads={dueTodayLeads}
        />
        <FollowUpSection
          title="Upcoming"
          dotColor="bg-blue-500"
          borderColor="border-l-4 border-l-blue-500"
          leads={upcomingLeads}
        />
      </div>
    </DashboardLayout>
  );
};

export default FollowUps;
