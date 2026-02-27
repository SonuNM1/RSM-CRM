// src/components/leads/StatusBadge.tsx
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Assigned": "bg-indigo-100 text-indigo-700",
  "RNR": "bg-yellow-100 text-yellow-700",
  "Answered": "bg-green-100 text-green-700",
  "Number NA": "bg-gray-100 text-gray-600",
  "Out of Service": "bg-gray-100 text-gray-600",
  "Can't Connect": "bg-gray-100 text-gray-600",
  "DNS": "bg-purple-100 text-purple-700",
  "Follow Up": "bg-orange-100 text-orange-700",
  "Interested": "bg-emerald-100 text-emerald-700",
  "Not Interested": "bg-red-100 text-red-600",
  "Qualified": "bg-teal-100 text-teal-700",
  "Converted": "bg-green-200 text-green-800",
  "Lost": "bg-red-100 text-red-700",
  "Trash": "bg-slate-100 text-slate-500",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span className={cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    statusStyles[status] || "bg-gray-100 text-gray-600",
    className
  )}>
    {status}
  </span>
);