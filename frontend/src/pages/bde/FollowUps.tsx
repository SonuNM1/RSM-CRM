import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFollowUpsAPI } from "@/api/dashboard.api";

// --- helpers ---
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
const formatFollowUpDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

// --- types ---
interface FollowUpLead {
  _id: string;
  name: string;
  website: string;
  followUpDate: string;
}

// --- card ---
const FollowUpCard = ({
  lead,
  borderColor,
}: {
  lead: FollowUpLead;
  borderColor: string;
}) => {
  const navigate = useNavigate();
  return (
    <Card
      className={`bg-card border border-border rounded-xl p-5 ${borderColor}`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(lead.name)}`}
          >
            {getInitials(lead.name)}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.website}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{formatFollowUpDate(lead.followUpDate)}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/my-pipeline/${lead._id}`)}
        >
          View Lead
        </Button>
      </div>
    </Card>
  );
};

// --- section inside each tab ---
const FollowUpTabContent = ({
  leads,
  borderColor,
  emptyMsg,
}: {
  leads: FollowUpLead[];
  borderColor: string;
  emptyMsg: string;
}) =>
  leads.length === 0 ? (
    <p className="text-sm text-muted-foreground">{emptyMsg}</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {leads.map((lead) => (
        <FollowUpCard key={lead._id} lead={lead} borderColor={borderColor} />
      ))}
    </div>
  );

// --- main page ---
const FollowUps = () => {
  const navigate = useNavigate();
  const [overdue, setOverdue] = useState<FollowUpLead[]>([]);
  const [dueToday, setDueToday] = useState<FollowUpLead[]>([]);
  const [upcoming, setUpcoming] = useState<FollowUpLead[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await getFollowUpsAPI();
        if (res.data.success) {
          setOverdue(res.data.overdue);
          setDueToday(res.data.dueToday);
          setUpcoming(res.data.upcoming);
          setTotal(res.data.total);
        }
      } catch (error) {
        console.error("FollowUps fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, []);

  return (
    <DashboardLayout title="My Follow-ups">
      <div className="space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
            {total !== null ? total : "—"} total
          </Badge>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <Tabs defaultValue="overdue">
            <TabsList className="mb-4 gap-2">
              <TabsTrigger
                value="overdue"
                className="data-[state=active]:bg-[#19B3A6] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Overdue ({overdue.length})
              </TabsTrigger>
              <span
                style={{ color: "#19B3A6" }}
                className="text-lg font-light select-none"
              >
                |
              </span>
              <TabsTrigger
                value="today"
                className="data-[state=active]:bg-[#19B3A6] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Due Today ({dueToday.length})
              </TabsTrigger>
              <span
                style={{ color: "#19B3A6" }}
                className="text-lg font-light select-none"
              >
                |
              </span>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-[#19B3A6] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Upcoming ({upcoming.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overdue">
              <FollowUpTabContent
                leads={overdue}
                borderColor="border-l-4 border-l-red-500"
                emptyMsg="No overdue follow-ups."
              />
            </TabsContent>

            <TabsContent value="today">
              <FollowUpTabContent
                leads={dueToday}
                borderColor="border-l-4 border-l-orange-500"
                emptyMsg="No follow-ups due today."
              />
            </TabsContent>

            <TabsContent value="upcoming">
              <FollowUpTabContent
                leads={upcoming}
                borderColor="border-l-4 border-l-blue-500"
                emptyMsg="No upcoming follow-ups."
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FollowUps;
