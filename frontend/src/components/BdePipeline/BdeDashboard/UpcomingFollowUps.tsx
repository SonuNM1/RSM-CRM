import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FollowUpLead } from "@/types/lead";
import { getFollowUpType, formatFollowUpDate } from "@/utils/dateHelpers";

const borderByType = {
  overdue: "border-l-4 border-l-red-500",
  today: "border-l-4 border-l-orange-500",
  upcoming: "border-l-4 border-l-blue-500",
};

const UpcomingFollowUps = ({ followUps }: { followUps: FollowUpLead[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Follow-ups</h2>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/follow-ups")}>
          See All Follow-ups
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {followUps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming follow-ups.</p>
        ) : (
          followUps.map((fu) => (
            <Card
              key={fu._id}
              className={`bg-card border border-border rounded-xl p-5 ${borderByType[getFollowUpType(fu.followUpDate)]}`}
            >
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground">{fu.name}</p>
                  <p className="text-sm text-muted-foreground">{fu.website}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatFollowUpDate(fu.followUpDate)}
                </p>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/my-pipeline/${fu._id}`)}>
                    View Lead
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingFollowUps;