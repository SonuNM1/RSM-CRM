import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead, LeadsTableProps } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";

export function LeadsTable({
  leads,
  selectedIds,
  onSelectionChange,
  onRowClick,
  loading,
}: LeadsTableProps) {
  const allSelected = selectedIds.length === leads.length && leads.length > 0;

  const someSelected =
    selectedIds.length > 0 && selectedIds.length < leads.length;

  const toggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const checked = e.target.checked;

                  if (checked) {
                    onSelectionChange(leads.map((l) => l.id));
                  } else {
                    onSelectionChange([]);
                  }
                }}
              />
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Name
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Email
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Website
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Submitted By
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Submitted On
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-40 text-center text-muted-foreground"
              >
                Loading leads...
              </TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-40 text-center text-muted-foreground"
              >
                No leads found
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow
                key={lead.id}
                className={
                  onRowClick
                    ? "cursor-pointer hover:bg-muted/30 transition-colors"
                    : ""
                }
                onClick={() => onRowClick?.(lead.id)}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleRow(lead.id);
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {lead.email}
                </TableCell>
                <TableCell>
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lead.website.replace("https://", "")}
                  </a>
                </TableCell>
                <TableCell>{lead.submittedBy}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(lead.submittedDate).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
