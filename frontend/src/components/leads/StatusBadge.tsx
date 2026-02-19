
import { cn } from "@/lib/utils";
import { LeadStatus } from "@/types/lead";

interface StatusBadgeProps {
  status: LeadStatus ; 
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Contacted: "bg-yellow-50 text-yellow-800 border-yellow-200",
  Qualified: "bg-green-50 text-green-700 border-green-200",
  Lost: "bg-red-50 text-red-700 border-red-200",
  Trash: "bg-gray-100 text-gray-600 border-gray-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}>
      {status}
    </span>
  );
}