import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "../leads/StatusBadge";
import { Mail, Phone, Globe, CalendarDays } from "lucide-react";

interface LeadInfoCardProps {
  name: string;
  email: string;
  phone: string;
  website: string;
  assignedDate: string;
  status: string;
}

export const LeadInfoCard = ({ name, email, phone, website, assignedDate, status }: LeadInfoCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{name}</h2>
        <StatusBadge status={status} className="text-sm px-3 py-1" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: "Email", value: email },
          { icon: Phone, label: "Phone", value: phone },
          { icon: Globe, label: "Website", value: website },
          { icon: CalendarDays, label: "Assigned Date", value: assignedDate },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
