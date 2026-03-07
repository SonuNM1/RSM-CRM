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
  return api.post(`/api/leads/submit-leads`, payload);
};

// Get leads

export const fetchLeadsAPI = (params?: Record<string, any>) => {
  return api.get(`/api/leads/all-leads`, {
    params,
  });
};

// lead status 

export const fetchLeadStatusesAPI = () => {
  return api.get(`/api/leads/lead-statuses`)
}

// fetch lead statuses

export const fetchNewLeadsAPI = (params?: {
  page?: number;
  limit?: number;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  return api.get(`/api/leads/all-leads/new`, {
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

// update lead status API (BDE)

export const updateLeadStatusAPI = (leadId: string, status: string) => {
  return api.patch(`/api/leads/${leadId}/status`, { status });
};

// GET lead by id (BdeTimeline)

export const getLeadByIdAPI = (leadId: string) => {
  return api.get(`/api/leads/${leadId}`)
}

// Update lead status (with notes)

export const updateLeadActivityAPI = (leadId: string, data: {
  status?: string; 
  note?: string; 
  meetingDate?: string;
  followUpDate?: string;
}) => {
  return api.post(`/api/leads/${leadId}/activity`, data);
};

// Get lead activity (status and notes)

export const getLeadActivitiesAPI = (leadId: string) => {
  return api.get(`/api/leads/${leadId}/activities`) ; 
}

// get leads that you submitted (email team)

export const getMyLeadsAPI = (params: {
  page?: number ; 
  limit?: number ; 
  search?: string ;
  dateFrom?: string ; 
  dateTo?: string ; 
}) => {
  return api.get("/api/leads/leads-submitted", {params})
}

// get leads that submitted (email team) - particular 

export const getMyLeadByIdAPI = (leadId: string) => {
  return api.get(`/api/leads/leads-submitted/${leadId}`);
};
