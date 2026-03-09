import api from "./axios";

// email team

export const getMyLeadStatsAPI = () => {
  return api.get('/api/dashboard/email/my-stats');
};

// BDE team 

export const getFollowUpsAPI = () => {
  return api.get("/api/dashboard/follow-ups");
}

export const getBdeDashboardStatsAPI = () => {
  return api.get("/api/dashboard/bde-stats") ; 
};

export const getMeetingStatsAPI = () => {
  return api.get("/api/dashboard/meeting-stats")
}

export const getMeetingsAPI = () => {
  return api.get("/api/dashboard/meetings")
};

export const updateMeetingOutcomeAPI = (leadId: string, data: { happened: boolean; status: string; note?: string }) =>
  api.patch(`/api/dashboard/${leadId}/meeting-outcome`, data);


export const getConvertedLeadsAPI = () => api.get("/api/dashboard/converted-leads");