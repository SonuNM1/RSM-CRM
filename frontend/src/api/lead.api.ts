import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LeadPayload {
  website: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  comments?: string;
}

// submit leads API

export const submitLeadsAPI = (payload: { leads: LeadPayload[] }) => {
  return api.post(`${BASE_URL}/api/leads/submit-leads`, payload);
};

// Get leads

export const fetchLeadsAPI = (params?: Record<string, any>) => {
  return api.get(`${BASE_URL}/api/leads/all-leads`, {
    params,
  });
};

// lead status 

export const fetchLeadStatusesAPI = () => {
  return api.get(`${BASE_URL}/api/leads/lead-statuses`)
}

// fetch lead statuses

export const fetchNewLeadsAPI = (params?: {
  page?: number;
  limit?: number;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  return api.get(`${BASE_URL}/api/leads/all-leads/new`, {
    params,
  });
};

// lead assign to BDE 

export const assignLeadsAPI = (data: {
  leadIds: string[];
  assignedTo: string;
}) => {
  return api.patch("/api/leads/assign", data);
};

// Get leads assigned to me 

export const getMyPipelineLeadsAPI = (params: any) => {
  console.log("API called with params:", params);
  return api.get("/api/leads/my-pipeline", { params })
} 

export const updateLeadStatusAPI = (leadId: string, status: string) => {
  return api.patch(`/api/leads/${leadId}/status`, { status });
};
