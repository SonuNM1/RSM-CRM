import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LeadInfoCard } from "@/components/BdePipeline/LeadInfoCard";
import ActivityTimeline from "@/components/BdePipeline/ActivityTimeline";
import { ClientContextCard } from "@/components/BdePipeline/ClientContextCard";
import { UpdateLeadCard } from "@/components/BdePipeline/UpdateLeadCard";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";
import { format } from "date-fns";
import { getLeadByIdAPI } from "@/api/lead.api"; // Import the API
import FullPageLoader from "@/components/FullPageLoader";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  assignedAt: string | null;
  assignedBy: string;
  comments?: string 
}

const BdeTimeline = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // For triggering refresh

  const fetchLeadDetails = async () => {
    if(!leadId){
      navigate("/my-pipeline") ; 
      return ; 
    }

    try {
      setLoading(true);
      
      const res = await getLeadByIdAPI(leadId);

      if(res.data.success){
        const apiLead = res.data.lead ; 
        setLead({
          id: apiLead._id, 
          name: apiLead.name, 
          email: apiLead.email, 
          phone: apiLead.phone, 
          website: apiLead.website, 
          status: apiLead.status, 
          assignedAt: apiLead.assignedAt, 
          assignedBy: apiLead.createdBy?.name || "-", 
          comments: apiLead.comments 
        })
      } else {
        toast.error("Lead not found", ERROR_TOAST) ; 
        navigate("/my-pipeline") ;
      }
    } catch (error) {
      console.error("BDE Timeline error: ", error) ; 
      toast.error(error?.response?.data?.message || "Failed to load lead details", ERROR_TOAST); 
      navigate("/my-pipeline") ; 
    } finally {
      setLoading(false) ;  
    }
  }

  useEffect(() => {
    fetchLeadDetails() ; 
  }, [leadId, navigate, refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Trigger re-fetch
  }

  if (loading) {
    return (
      <FullPageLoader/>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout title="Lead Timeline">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Lead not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Lead Timeline">
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}
          
          <div className="mb-6 flex items-center gap-4">
            <button 
              onClick={() => navigate("/my-pipeline")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Pipeline
            </button>
            <div className="h-5 w-px bg-border" />
          </div>
          
          {/* Two-column layout */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          
            {/* Left 60% */}
          
            <div className="space-y-6 lg:col-span-3">
              <LeadInfoCard
                name={lead.name}
                email={lead.email}
                phone={lead.phone}
                website={lead.website}
                assignedDate={lead.assignedAt ? format(new Date(lead.assignedAt), "MMM d, yyyy") : "—"}
                status={lead.status}
              />
              <ActivityTimeline leadId={leadId} refreshKey={refreshKey} assignedDate={lead.assignedAt} />
            </div>
            
            {/* Right 40% */}

            <div className="space-y-6 lg:col-span-2">
              <ClientContextCard comments={lead.comments} />
              <UpdateLeadCard
                leadId={leadId || ""}
                currentStatus={lead.status}
                onUpdate={handleRefresh}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BdeTimeline;