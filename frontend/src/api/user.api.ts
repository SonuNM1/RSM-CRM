import axios from "axios" ; 
import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ; 

// update user 

export const updateMe = (id: string, data: {name: string}) => {
    return api.put(
        `${BASE_URL}/api/users/${id}`, 
        data, 
    )
}

// Users who can submit leads 

export const fetchLeadCreatorsAPI = () => {
    return api.get(`${BASE_URL}/api/users/lead-creators`);
}

// fetch all employees 

export const fetchEmployeesAPI = (search?: string) => {
  return api.get(
    `${BASE_URL}/api/users/employees`, 
    {
        params: search ? {search} : {}
    }
  );
};