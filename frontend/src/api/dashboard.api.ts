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