import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { PipelineLead } from "@/types/lead";
import { getAvatarColor, getInitials } from "@/utils/avatarHelpers";
import { getRelativeTime } from "@/utils/dateHelpers";

const statusColors: Record<string, string> = {
  RNR: "bg-gray-100 text-gray-700",
  Answered: "bg-blue-100 text-blue-700",
  "Follow Up": "bg-orange-100 text-orange-700",
  Interested: "bg-green-100 text-green-700",
  "Not Interested": "bg-red-100 text-red-700",
  DNS: "bg-yellow-100 text-yellow-700",
};

const RecentPipeline = ({ leads }: { leads: PipelineLead[] }) => {
  const navigate = useNavigate();

  return (
    <Card className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Pipeline</h2>
        <Button variant="ghost" size="sm" onClick={() => navigate("/my-pipeline")}>
          See All
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/my-pipeline/${lead._id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(lead.name)}`}>
                    {getInitials(lead.name)}
                  </div>
                  <span className="font-medium text-foreground">{lead.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{lead.website}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[lead.status]}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getRelativeTime(lead.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RecentPipeline;