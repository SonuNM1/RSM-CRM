import { LeadStatus } from '@/data/mockLeads';
import { cn } from '@/lib/utils';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-status-new/15 text-status-new',
  Assigned: 'bg-status-assigned/15 text-status-assigned',
  Contacted: 'bg-status-contacted/15 text-status-contacted',
  Qualified: 'bg-status-qualified/15 text-status-qualified',
  Lost: 'bg-status-lost/15 text-status-lost',
  Trash: 'bg-status-trash/15 text-status-trash',
};

const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', statusStyles[status])}>
    {status}
  </span>
);

export default StatusBadge;
