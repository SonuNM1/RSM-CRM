import { useEffect, useState } from "react";
import { getBdeDashboardStatsAPI } from "@/api/dashboard.api";
import { FollowUpLead, PipelineHealthItem, PipelineLead } from "@/types/lead";
import StatsRow from "@/components/BdePipeline/BdeDashboard/StatsRow"; 
import RecentPipeline from "@/components/BdePipeline/BdeDashboard/RecentPipeline"; 
import PipelineHealth from "@/components/BdePipeline/BdeDashboard/PipelineHealth";
import UpcomingFollowUps from "@/components/BdePipeline/BdeDashboard/UpcomingFollowUps";

const BdeDashboard = () => {
  const [totalAssigned, setTotalAssigned] = useState<number | null>(null);
  const [followUpsTotal, setFollowUpsTotal] = useState<number | null>(null);
  const [meetingsScheduled, setMeetingsScheduled] = useState<number | null>(null);
  const [convertedLeads, setConvertedLeads] = useState<number | null>(null);
  const [recentPipeline, setRecentPipeline] = useState<PipelineLead[]>([]);
  const [pipelineHealth, setPipelineHealth] = useState<PipelineHealthItem[]>([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<FollowUpLead[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await getBdeDashboardStatsAPI();
        if (statsRes.data.success) {
          setTotalAssigned(statsRes.data.totalAssigned);
          setMeetingsScheduled(statsRes.data.meetingsScheduled);
          setConvertedLeads(statsRes.data.convertedLeads);
          setFollowUpsTotal(statsRes.data.followUpsTotal);
          setRecentPipeline(statsRes.data.recentPipeline);
          setPipelineHealth(statsRes.data.pipelineHealth);
          setUpcomingFollowUps(statsRes.data.upcomingFollowUps);
        }
      } catch (error) {
        console.error("BDE stats error:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <StatsRow
        totalAssigned={totalAssigned}
        followUpsTotal={followUpsTotal}
        meetingsScheduled={meetingsScheduled}
        convertedLeads={convertedLeads}
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <RecentPipeline leads={recentPipeline} />
        <PipelineHealth data={pipelineHealth} />
      </div>
      <UpcomingFollowUps followUps={upcomingFollowUps} />
    </div>
  );
};

export default BdeDashboard;