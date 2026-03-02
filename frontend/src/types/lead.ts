export type LeadStatus =
  | "New" | "Assigned"
  | "RNR" | "Answered" | "Number NA" | "Out of Service" | "Can't Connect" | "DNS"
  | "Follow Up" | "Interested" | "Not Interested"
  | "Qualified" | "Converted" | "Lost" | "Trash";

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