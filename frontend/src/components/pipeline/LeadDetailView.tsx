import React, { useState } from 'react';
import { Lead, LeadStatus, STATUSES } from '@/data/mockLeads';
import StatusBadge from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Globe, Mail, Phone, User, Calendar, MessageSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
}

const LeadDetailView = ({ lead, onBack }: LeadDetailViewProps) => {
  const [updateStatus, setUpdateStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pipeline
      </button>

      {/* A) Lead Summary */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">{lead.name}</h2>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {lead.email}</p>
              <p className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> {lead.website}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {lead.phone}</p>
            </div>
          </div>
          <div className="text-sm space-y-1.5">
            <StatusBadge status={lead.status} />
            <p className="flex items-center gap-2 text-muted-foreground mt-2">
              <User className="h-3.5 w-3.5" /> Assigned by {lead.assignedBy}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> {format(new Date(lead.assignedDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* B) Initial Context */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-primary" />
          Initial Lead Context
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-md p-4">
          {lead.initialComment}
        </p>
      </div>

      {/* C) Activity Timeline */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2 mb-5">
          <Clock className="h-4 w-4 text-primary" />
          Activity Timeline
        </h3>
        <div className="relative ml-3 border-l-2 border-border pl-6 space-y-6">
          {lead.activities.map((activity) => (
            <div key={activity.id} className="relative">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-card" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                <span className="text-xs text-muted-foreground font-medium">
                  {format(new Date(activity.date), 'MMM d, yyyy · h:mm a')}
                </span>
                <StatusBadge status={activity.status} />
              </div>
              <p className="text-sm text-card-foreground">{activity.note}</p>
              <p className="text-xs text-muted-foreground mt-0.5">by {activity.updatedBy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* D) Update Lead */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Update Lead</h3>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Status</label>
            <Select value={updateStatus} onValueChange={(v) => setUpdateStatus(v as LeadStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Notes</label>
            <Textarea
              placeholder="Add notes about this interaction..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          <Button>Update Lead</Button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailView;
