import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMeetingsAPI, getMeetingStatsAPI } from "@/api/dashboard.api";
import { Meeting } from "@/types/lead";
import { toast } from "sonner";
import { INFO_TOAST } from "@/constants/toast";
import { useAuth } from "@/context/AuthContext";
import { UpcomingCard, PastCard, UpdateOutcomeModal } from "@/components/BdePipeline/Meetings/MeetingCard";

const Meetings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "Super_Admin";

  const [totalMeetings, setTotalMeetings] = useState<number | null>(null);
  const [upcomingCount, setUpcomingCount] = useState<number | null>(null);
  const [pastCount, setPastCount] = useState<number | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (val: string, comingSoonTabs: string[]) => {
    if (comingSoonTabs.includes(val)) {
      toast.info("Feature under development - coming soon", INFO_TOAST);
    }
  };

  const handleViewLead = (id: string) =>
    isAdmin ? navigate(`/all-leads/${id}`) : navigate(`/my-pipeline/${id}`);

  const handleUpdateOutcome = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, meetingsRes] = await Promise.all([
          getMeetingStatsAPI(),
          getMeetingsAPI(),
        ]);
        if (statsRes.data.success) {
          setTotalMeetings(statsRes.data.total);
          setUpcomingCount(statsRes.data.upcoming);
          setPastCount(statsRes.data.past);
        }
        if (meetingsRes.data.success) {
          setUpcomingMeetings(meetingsRes.data.upcoming);
          setPastMeetings(meetingsRes.data.past);
        }
      } catch (error) {
        console.error("Meeting stats error:", error);
      }
    };
    fetchData();
  }, [refreshKey]);

  return (
    <DashboardLayout title="Meetings">
      <div className="space-y-6">
        {/* stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Meetings</p>
              <p className="text-2xl font-bold text-foreground">{totalMeetings ?? "—"}</p>
            </div>
          </Card>
          <Card className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-foreground">{upcomingCount ?? "—"}</p>
            </div>
          </Card>
          <Card className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <CalendarCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Past</p>
              <p className="text-2xl font-bold text-foreground">{pastCount ?? "—"}</p>
            </div>
          </Card>
        </div>

        {/* tabs */}
        <Tabs
          defaultValue="upcoming"
          onValueChange={(val) => handleTabChange(val, isAdmin ? [] : ["past"])}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming ({upcomingCount ?? "—"})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastCount ?? "—"})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming meetings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMeetings.map((m) => (
                  <UpcomingCard key={m._id} meeting={m} isAdmin={isAdmin} onViewLead={handleViewLead} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No past meetings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastMeetings.map((m) => (
                  <PastCard
                    key={m._id}
                    meeting={m}
                    isAdmin={isAdmin}
                    onViewLead={handleViewLead}
                    onUpdateOutcome={handleUpdateOutcome}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <UpdateOutcomeModal
        meeting={selectedMeeting}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedMeeting(null); }}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />
    </DashboardLayout>
  );
};

export default Meetings;