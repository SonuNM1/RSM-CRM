import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Phone, Mail, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";
import { getLeadActivitiesAPI } from "@/api/lead.api";
import { StatusBadge } from "../leads/StatusBadge";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Activity {
  _id: string;
  type: "status_change" | "note" | "call" | "email";
  content: string;
  timestamp: string;
  user: string;
  oldStatus?: string;
  newStatus?: string;
  updatedBy: {
    name: string;
  };
}

interface ActivityTimelineProps {
  leadId?: string;
  refreshKey?: number;
  assignedDate?: string | null; // to shfow initial assignment
}

const ActivityTimeline = ({
  leadId,
  refreshKey,
  assignedDate,
}: ActivityTimelineProps) => {
  const { user } = useAuth();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!leadId) return;

      try {
        if (initialLoad) setLoading(true);

        const res = await getLeadActivitiesAPI(leadId);

        if (res.data.success) {
          setActivities(res.data.activities);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load activities", ERROR_TOAST);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchActivities();
  }, [leadId, refreshKey]);

  const TIMEZONE = "Asia/Kolkata";

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const IST_OFFSET = 330;
    const istDate = new Date(date.getTime() + IST_OFFSET * 60 * 1000);
    const nowIST = new Date(new Date().getTime() + IST_OFFSET * 60 * 1000);

    const diffInMs = nowIST.getTime() - istDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinute = minutes.toString().padStart(2, "0");
    const time = `${displayHour}:${displayMinute} ${ampm}`;

    const day = istDate.getUTCDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[istDate.getUTCMonth()];
    const dateStr = `${day} ${month}`;

    if (diffInDays === 0) return `Today, ${time}`;
    if (diffInDays === 1) return `Yesterday, ${time}`;
    return `${dateStr}, ${time}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Loading activities...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 && !assignedDate ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No activities yet
          </p>
        ) : (
          <div className="relative space-y-4">
            {/* Timeline line */}

            <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

            {!assignedDate && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                This lead has not been assigned to a BDE yet.
              </p>
            )}

            {/* Activities */}

            {activities.map((activity) => (
              <div key={activity._id} className="relative flex gap-4 group">
                
                {/* Icon */}
                
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                
                {/* Content */}
                
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {activity.type === "status_change" &&
                      activity.oldStatus &&
                      activity.newStatus ? (
                        <p className="text-sm font-medium leading-relaxed">
                          Status changed from{" "}
                          <StatusBadge
                            status={activity.oldStatus}
                            className="inline-flex"
                          />{" "}
                          to{" "}
                          <StatusBadge
                            status={activity.newStatus}
                            className="inline-flex"
                          />
                        </p>
                      ) : (
                        <p className="text-sm font-medium leading-relaxed">
                          {activity.content}
                        </p>
                      )}
                      {activity.content?.trim() &&
                        activity.type === "status_change" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Note: {activity.content}
                          </p>
                        )}
                    </div>
                
                    {/* Delete button — only for assigned BDE */}
                
                    {user?.role === "BDE_Executive" && (
                      <button
                        onClick={() =>
                          toast.info("Feature under development, coming soon!")
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Initial assignment (shown last chronologically, at bottom) */}

            {assignedDate && (
              <div className="relative flex gap-4">
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                  <Clock className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-relaxed">
                        Lead assigned{" "}
                        <StatusBadge
                          status="Assigned"
                          className="inline-flex"
                        />
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(assignedDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
