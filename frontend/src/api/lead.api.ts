import axios from "axios";
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

export const submitLeadsAPI = (payload: { leads: LeadPayload[]}) => {
    return api.post(
        `${BASE_URL}/api/leads/submit-leads`, 
        payload, 
    )
}

// Get leads 

export const fetchLeadsAPI = (params?: Record<string, any>) => {
    return api.get(
        `${BASE_URL}/api/leads/all-leads`, 
        {
            params, 
        }
    )
}

// fetch lead statuses 

export const fetchLeadStatusesAPI = () => {
    return api.get(`${BASE_URL}/api/leads/lead-statuses`)
}