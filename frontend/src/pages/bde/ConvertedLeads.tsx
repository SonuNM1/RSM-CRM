import { getConvertedLeadsAPI } from "@/api/dashboard.api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ConvertedLead } from "@/types/lead";
import { getAvatarColor, getInitials } from "@/utils/avatarHelpers";
import { getRelativeTime } from "@/utils/dateHelpers";
import { ArrowLeft, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ConvertedLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<ConvertedLead[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getConvertedLeadsAPI();
        if (res.data.success) {
          setLeads(res.data.leads);
          setTotal(res.data.total);
        }
      } catch (error) {
        console.error("ConvertedLeads fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout title="Converted Leads">
      <div className="space-y-6">

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
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No converted leads yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <Card
                key={lead._id}
                className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-green-500 space-y-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/my-pipeline/${lead._id}`)}
              >
                {/* avatar + name */}
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(lead.name)}`}>
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.website}</p>
                  </div>
                </div>
                {/* email + phone */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                  <p className="text-xs text-muted-foreground">{lead.phone}</p>
                </div>
                {/* footer */}
                <div className="flex items-center justify-between pt-1">
                  <Badge className="bg-green-200 text-green-800 pointer-events-none">
                    Converted
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(lead.updatedAt)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ConvertedLeads;

