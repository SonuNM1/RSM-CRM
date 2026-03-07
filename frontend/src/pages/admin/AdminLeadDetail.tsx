import ActivityTimeline from "@/components/BdePipeline/ActivityTimeline";
import { LeadInfoCard } from "@/components/BdePipeline/LeadInfoCard";
import DashboardLayout from "@/components/DashboardLayout";
import React, { useEffect, useState } from "react";
import { ClientContextCard } from "@/components/BdePipeline/ClientContextCard";
import { UpdateLeadCard } from "@/components/BdePipeline/UpdateLeadCard";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminLead } from "@/types/lead";
import { getLeadByIdAPI } from "@/api/lead.api";
import { ERROR_TOAST } from "@/constants/toast";
import { toast } from "sonner";
import FullPageLoader from "@/components/FullPageLoader";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const AdminLeadDetail = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<AdminLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [activityRefreshKey, setActivityRefreshKey] = useState(0);

  const { user } = useAuth();
  const isAdminOrSuperAdmin =
    user?.role === "Admin" || user?.role === "Super_Admin";

  const fetchLead = async (silent = false) => {
    if (!leadId) {
      navigate("/all-leads");
      return;
    }

    if (!silent) setLoading(true);

    try {
      const res = await getLeadByIdAPI(leadId);

      if (res.data.success) {
        const l = res.data.lead;
        setLead({
          id: l._id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          website: l.website,
          status: l.status,
          assignedTo: l.assignedTo?.name ?? undefined,
          assignedBy: l.createdBy?.name ?? undefined,
          assignedAt: l.assignedAt ?? null,
          comments: l.comments,
        });
      } else {
        toast.error("Lead not found", ERROR_TOAST);
        navigate("/all-leads");
      }
    } catch (error) {
      toast.error("Failed to load lead details", ERROR_TOAST);
      navigate("/all-leads");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  useEffect(() => {
    if (refreshKey > 0) fetchLead(true);
  }, [refreshKey]);

  const handleRefresh = () => {
    setActivityRefreshKey((prev) => prev + 1);
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) return <FullPageLoader />;

  if (!lead)
    return (
      <DashboardLayout title="Lead Detail">
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Lead not found.
        </div>
      </DashboardLayout>
    );

  const isAssigned = !!lead.assignedTo; // lead is assigned if assignedTo exists

  return (
    <DashboardLayout title="Lead Detail">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* back button */}

        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/all-leads")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Leads
          </button>
        </div>

        {/* Two grid layout */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left - 60% */}

          <div className="space-y-6 lg:col-span-3">
            <LeadInfoCard
              name={lead.name}
              email={lead.email}
              phone={lead.phone}
              website={lead.website}
              status={lead.status}
              isAssigned={isAssigned}
              assignedTo={lead.assignedTo}
              showAssignedTo={isAdminOrSuperAdmin}
              assignedDate={
                lead.assignedAt
                  ? format(new Date(lead.assignedAt), "MMM d, yyyy")
                  : null
              }
            />
            <ActivityTimeline
              leadId={leadId ?? ""}
              refreshKey={activityRefreshKey}
              assignedDate={lead.assignedAt}
            />
          </div>

          {/* Right - 40% */}

          <div className="space-y-6 lg:col-span-2">
            <ClientContextCard comments={lead.comments} />
            <UpdateLeadCard
              leadId={leadId ?? ""}
              currentStatus={lead.status}
              onUpdate={handleRefresh}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeadDetail;
