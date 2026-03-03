import api from "./axios";

export const getMyLeadStatsAPI = () => {
  return api.get('/api/dashboard/email/my-stats');
};