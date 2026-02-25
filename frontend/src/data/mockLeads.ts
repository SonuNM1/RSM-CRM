export type LeadStatus = 'New' | 'Assigned' | 'Contacted' | 'Qualified' | 'Lost' | 'Trash';

export interface LeadActivity {
  id: string;
  date: string;
  status: LeadStatus;
  note: string;
  updatedBy: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  website: string;
  phone: string;
  assignedBy: string;
  assignedDate: string;
  status: LeadStatus;
  initialComment: string;
  activities: LeadActivity[];
}

export const STATUSES: LeadStatus[] = ['New', 'Assigned', 'Contacted', 'Qualified', 'Lost', 'Trash'];

export const mockLeads: Lead[] = [
  {
    id: '1', name: 'Priya Sharma', email: 'priya@techvista.in', website: 'techvista.in',
    phone: '+91 98765 43210', assignedBy: 'Rahul Verma', assignedDate: '2026-02-18',
    status: 'New', initialComment: 'Interested in enterprise CRM solution for 200+ users. Reached out via website contact form.',
    activities: [
      { id: 'a1', date: '2026-02-18T10:30:00', status: 'New', note: 'Lead created from inbound form submission.', updatedBy: 'System' },
      { id: 'a2', date: '2026-02-18T11:00:00', status: 'Assigned', note: 'Assigned to Amit Kumar for follow-up.', updatedBy: 'Rahul Verma' },
    ],
  },
  {
    id: '2', name: 'Vikram Patel', email: 'vikram@novaedge.com', website: 'novaedge.com',
    phone: '+91 87654 32109', assignedBy: 'Sneha Iyer', assignedDate: '2026-02-15',
    status: 'Contacted', initialComment: 'Met at SaaS India 2026 conference. Looking for sales automation.',
    activities: [
      { id: 'b1', date: '2026-02-15T09:00:00', status: 'New', note: 'Lead added from conference list.', updatedBy: 'Sneha Iyer' },
      { id: 'b2', date: '2026-02-16T14:20:00', status: 'Assigned', note: 'Assigned to Amit.', updatedBy: 'Sneha Iyer' },
      { id: 'b3', date: '2026-02-17T10:00:00', status: 'Contacted', note: 'Called. Discussed requirements. Scheduled demo for next week.', updatedBy: 'Amit Kumar' },
    ],
  },
  {
    id: '3', name: 'Meera Joshi', email: 'meera@brightpath.co', website: 'brightpath.co',
    phone: '+91 76543 21098', assignedBy: 'Rahul Verma', assignedDate: '2026-02-10',
    status: 'Qualified', initialComment: 'Referral from existing client. Needs CRM + helpdesk integration.',
    activities: [
      { id: 'c1', date: '2026-02-10T08:30:00', status: 'New', note: 'Referral lead added.', updatedBy: 'Rahul Verma' },
      { id: 'c2', date: '2026-02-11T11:00:00', status: 'Contacted', note: 'Introductory call completed. Very interested.', updatedBy: 'Amit Kumar' },
      { id: 'c3', date: '2026-02-14T15:00:00', status: 'Qualified', note: 'Demo completed. Budget approved. Moving to proposal.', updatedBy: 'Amit Kumar' },
    ],
  },
  {
    id: '4', name: 'Arjun Reddy', email: 'arjun@cloudnext.io', website: 'cloudnext.io',
    phone: '+91 65432 10987', assignedBy: 'Sneha Iyer', assignedDate: '2026-02-12',
    status: 'Lost', initialComment: 'Outbound prospecting. Mid-size IT services company.',
    activities: [
      { id: 'd1', date: '2026-02-12T10:00:00', status: 'New', note: 'Added via outbound.', updatedBy: 'Sneha Iyer' },
      { id: 'd2', date: '2026-02-13T09:30:00', status: 'Contacted', note: 'Called. Didn\'t pick up.', updatedBy: 'Amit Kumar' },
      { id: 'd3', date: '2026-02-15T10:00:00', status: 'Contacted', note: 'Called again. Spoke briefly. Not interested right now.', updatedBy: 'Amit Kumar' },
      { id: 'd4', date: '2026-02-17T16:00:00', status: 'Lost', note: 'Marked as lost. Already using competitor product.', updatedBy: 'Amit Kumar' },
    ],
  },
  {
    id: '5', name: 'Kavitha Nair', email: 'kavitha@greenleaf.org', website: 'greenleaf.org',
    phone: '+91 54321 09876', assignedBy: 'Rahul Verma', assignedDate: '2026-02-20',
    status: 'New', initialComment: 'NGO looking for donor management + CRM. Budget conscious.',
    activities: [
      { id: 'e1', date: '2026-02-20T12:00:00', status: 'New', note: 'Lead created.', updatedBy: 'System' },
    ],
  },
  {
    id: '6', name: 'Rohan Mehta', email: 'rohan@finpulse.in', website: 'finpulse.in',
    phone: '+91 43210 98765', assignedBy: 'Sneha Iyer', assignedDate: '2026-02-08',
    status: 'Contacted', initialComment: 'Fintech startup. Needs lead tracking and pipeline management.',
    activities: [
      { id: 'f1', date: '2026-02-08T09:00:00', status: 'New', note: 'Inbound lead from LinkedIn campaign.', updatedBy: 'System' },
      { id: 'f2', date: '2026-02-09T10:30:00', status: 'Contacted', note: 'Initial call done. Requested pricing info.', updatedBy: 'Amit Kumar' },
    ],
  },
  {
    id: '7', name: 'Deepa Krishnan', email: 'deepa@orbithq.com', website: 'orbithq.com',
    phone: '+91 32109 87654', assignedBy: 'Rahul Verma', assignedDate: '2026-02-05',
    status: 'Trash', initialComment: 'Duplicate entry — same as lead #3.',
    activities: [
      { id: 'g1', date: '2026-02-05T08:00:00', status: 'New', note: 'Lead created.', updatedBy: 'System' },
      { id: 'g2', date: '2026-02-06T09:00:00', status: 'Trash', note: 'Duplicate. Moved to trash.', updatedBy: 'Rahul Verma' },
    ],
  },
  {
    id: '8', name: 'Suresh Gupta', email: 'suresh@buildkraft.com', website: 'buildkraft.com',
    phone: '+91 21098 76543', assignedBy: 'Sneha Iyer', assignedDate: '2026-02-19',
    status: 'Assigned', initialComment: 'Construction company. Needs project-based CRM. 50 users.',
    activities: [
      { id: 'h1', date: '2026-02-19T14:00:00', status: 'New', note: 'Lead from partner referral.', updatedBy: 'Sneha Iyer' },
      { id: 'h2', date: '2026-02-19T14:30:00', status: 'Assigned', note: 'Assigned to Amit for immediate follow-up.', updatedBy: 'Sneha Iyer' },
    ],
  },
  {
    id: '9', name: 'Ananya Das', email: 'ananya@medicore.health', website: 'medicore.health',
    phone: '+91 10987 65432', assignedBy: 'Rahul Verma', assignedDate: '2026-02-21',
    status: 'New', initialComment: 'Healthcare SaaS. Interested in patient relationship management module.',
    activities: [
      { id: 'i1', date: '2026-02-21T11:00:00', status: 'New', note: 'Lead from webinar registration.', updatedBy: 'System' },
    ],
  },
  {
    id: '10', name: 'Nikhil Bose', email: 'nikhil@swiftlogix.com', website: 'swiftlogix.com',
    phone: '+91 09876 54321', assignedBy: 'Sneha Iyer', assignedDate: '2026-02-14',
    status: 'Qualified', initialComment: 'Logistics company. Strong intent. Needs fleet + CRM integration.',
    activities: [
      { id: 'j1', date: '2026-02-14T08:00:00', status: 'New', note: 'Inbound from Google Ads.', updatedBy: 'System' },
      { id: 'j2', date: '2026-02-15T10:00:00', status: 'Contacted', note: 'Discovery call completed. Good fit.', updatedBy: 'Amit Kumar' },
      { id: 'j3', date: '2026-02-18T14:00:00', status: 'Qualified', note: 'Technical demo done. Procurement initiated.', updatedBy: 'Amit Kumar' },
    ],
  },
  {
    id: '11', name: 'Fatima Sheikh', email: 'fatima@edustar.edu', website: 'edustar.edu',
    phone: '+91 98712 34567', assignedBy: 'Rahul Verma', assignedDate: '2026-02-22',
    status: 'New', initialComment: 'EdTech platform. Looking for student enrollment CRM.',
    activities: [
      { id: 'k1', date: '2026-02-22T09:00:00', status: 'New', note: 'Lead from email campaign.', updatedBy: 'System' },
    ],
  },
  {
    id: '12', name: 'Rajesh Iyer', email: 'rajesh@solarmax.energy', website: 'solarmax.energy',
    phone: '+91 87612 34567', assignedBy: 'Sneha Iyer', assignedDate: '2026-02-11',
    status: 'Contacted', initialComment: 'Renewable energy company. Needs dealer management CRM.',
    activities: [
      { id: 'l1', date: '2026-02-11T10:00:00', status: 'New', note: 'Partner referral.', updatedBy: 'Sneha Iyer' },
      { id: 'l2', date: '2026-02-13T11:00:00', status: 'Contacted', note: 'Introductory call. Interested but need to check with CTO.', updatedBy: 'Amit Kumar' },
    ],
  },
];
