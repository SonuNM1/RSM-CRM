import { DateRange } from "react-day-picker";
import { LeadCreator } from "./user";

export type LeadStatus =
  | "New" | "Assigned"
  | "RNR" | "Answered" | "Number NA" | "Out of Service" | "Can't Connect" | "DNS"
  | "Follow Up" | "Interested" | "Not Interested"
  | "Qualified" | "Converted" | "Lost" | "Trash"
  | "Meeting Scheduled"; 

export interface UpdateLeadCardProps {
  leadId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string; 
  comments: string ; 
  website: string;
  submittedBy: string;
  submittedDate: string;
  status: LeadStatus;
  assignedBy?: string;
  assignedAt?: string;
}
export interface ConversationModalProps {
  open: boolean;
  onClose: () => void;
  rowId: number | null;
  initialValue: string;
  onSave: (rowId: number, comments: string) => void;
}

export interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  assignedTo?: string;   
  assignedBy?: string;   
  assignedAt?: string | null;
  comments?: string;
}

export interface FiltersState {
  search: string;
  status: LeadStatus | "All";
  submittedBy: string;
  dateRange: DateRange | undefined;
}
export interface LeadsFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  statuses: string[];
  employees: LeadCreator[];
}

export interface Meeting {
  _id: string;
  name: string;
  website: string;
  meetingDate: string;
  status: string;
  hadMeeting: boolean;
  outcomeStatus: string | null;
  assignedTo?: { _id: string; name: string };
}

export interface PipelineLead {
  _id: string;
  name: string;
  website: string;
  status: string;
  updatedAt: string;
}

export interface PipelineHealthItem {
  status: string; 
  count: number; 
}
export interface FollowUpLead {
  _id: string;
  name: string;
  website: string;
  followUpDate: string;
}

export interface SectionProps {
  title: string;
  dotColor: string;
  borderColor: string;
  leads: FollowUpLead[];
}

export interface ConvertedLead {
  _id: string;
  name: string;
  website: string;
  email: string;
  phone: string;
  status: string;
  updatedAt: string;
}