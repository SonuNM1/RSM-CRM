export interface ApiLead {
  _id: string;
  name: string;
  email: string;
  website: string;
  phone?: string;
  comments?: string;
  createdAt: string;
  status?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}
