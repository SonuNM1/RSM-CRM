import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Phone, Mail, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";
import { getLeadActivitiesAPI } from "@/api/lead.api";
import { StatusBadge } from "../leads/StatusBadge";

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
  assignedDate?: string | null ; // to show initial assignment 
}

const ActivityTimeline = ({ leadId, refreshKey, assignedDate }: ActivityTimelineProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!leadId) return;

      try {
        setLoading(true);

        const res = await getLeadActivitiesAPI(leadId);

        if (res.data.success) {
          setActivities(res.data.activities);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load activities", ERROR_TOAST);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [leadId, refreshKey]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
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

            {/* Activities */}

            {activities.map((activity) => (
              <div key={activity.id} className="relative flex gap-4">

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
                          <StatusBadge status={activity.oldStatus} className="inline-flex"/>
                          {" "}
                          to{" "}
                          <StatusBadge status={activity.newStatus} className="inline-flex"/>
                        </p>
                      ) : (
                        <p className="text-sm font-medium leading-relaxed">
                          {activity.content}
                        </p>
                      )}
                      {activity.content &&
                        activity.type === "status_change" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Note: {activity.content}
                          </p>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    by {activity.updatedBy?.name || "Unknown"}
                  </p> */}
                </div>
              </div>
            ))}

            {/* Initial assignment (shown last chronologically, at bottom) */}

            {
              assignedDate && (
                <div className="relative flex gap-4">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    <Clock className="h-4 w-4"/>
                  </div>

                  <div className="flex-1 space-y-1 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-relaxed">
                            Lead assigned {" "}
                            <StatusBadge status="Assigned" className="inline-flex" />
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(assignedDate)}
                      </span>
                    </div>
                  </div>

                </div>
              )
            }

          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
