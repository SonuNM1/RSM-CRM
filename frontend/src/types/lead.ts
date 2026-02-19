export type LeadStatus = 
    | "New"
    | "Contacted"
    | "Qualified"
    | "Lost"
    | "Trash"

export interface Lead {
    id: string, 
    name: string, 
    email: string, 
    website: string, 
    submittedBy: string, 
    submittedDate: string, 
    status: LeadStatus
}

