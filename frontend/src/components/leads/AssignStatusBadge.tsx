import { cn } from "@/lib/utils";

export type AssignStatus = "New" | "Assigned";

interface AssignStatusBadgeProps {
  status: AssignStatus;
}

const AssignStatusBadge = ({ status }: AssignStatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-300",
        status === "New" && "bg-badge-new text-badge-new-foreground",
        status === "Assigned" &&
          "bg-badge-assigned text-badge-assigned-foreground"
      )}
    >
      {status}
    </span>
  );
};

export default AssignStatusBadge;
