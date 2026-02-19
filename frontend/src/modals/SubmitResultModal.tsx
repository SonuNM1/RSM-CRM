import React from "react";

interface DuplicateLead {
  name: string;
  email: string;
  website: string;
}

interface LeadResultModalProps {
  open: boolean;
  totalSubmitted: number;
  successCount: number; 
  duplicateCount: number ; 
  insertedCount: number;
  skippedCount: number;
  duplicates: DuplicateLead[];
  onClose: () => void;
}

const SubmitResultModal: React.FC<LeadResultModalProps> = ({
  open,
  totalSubmitted,
  insertedCount,
  skippedCount,
  duplicates,
  onClose,
}) => {
  if (!open) return null;

  const allDuplicates = insertedCount === 0 && skippedCount > 0;

  const title = allDuplicates
    ? "Duplicate Leads Detected"
    : skippedCount > 0
    ? "Leads Processed"
    : "Leads Submitted Successfully";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 rounded-lg border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded border border-border bg-muted/50 px-3 py-2.5 text-center">
              <p className="text-xs text-muted-foreground">Total Submitted</p>
              <p className="text-lg font-semibold">{totalSubmitted}</p>
            </div>
            <div className="rounded border border-border bg-muted/50 px-3 py-2.5 text-center">
              <p className="text-xs text-muted-foreground">Saved</p>
              <p className="text-lg font-semibold text-green-600">
                {insertedCount}
              </p>
            </div>
            <div className="rounded border border-border bg-muted/50 px-3 py-2.5 text-center">
              <p className="text-xs text-muted-foreground">Duplicates</p>
              <p className="text-lg font-semibold text-yellow-600">
                {skippedCount}
              </p>
            </div>
          </div>

          {/* All duplicate info */}
          {allDuplicates && (
            <div className="rounded border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
              All submitted leads already exist. No new leads were added.
            </div>
          )}

          {/* Duplicate table */}
          {skippedCount > 0 && duplicates.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Duplicate entries ({skippedCount})
              </p>

              <div className="max-h-[200px] overflow-y-auto rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicates.map((d, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-b-0 hover:bg-muted/50"
                      >
                        <td className="px-3 py-1.5">{d.name}</td>
                        <td className="px-3 py-1.5">{d.email}</td>
                        <td className="px-3 py-1.5">{d.website}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-5 py-3">
          <button
            onClick={onClose}
            className="rounded bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitResultModal;
