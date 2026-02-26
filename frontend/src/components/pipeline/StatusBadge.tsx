import { cn } from "@/lib/utils";
import { LEAD_STATUS_COLORS } from "@/constants/leadStatus";

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = LEAD_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      colorClass
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;