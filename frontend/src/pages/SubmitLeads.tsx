import DashboardLayout from "@/components/DashboardLayout";
import React, { useCallback, useState } from "react";
import countries from "../data/countries.json" assert { type: "JSON" };
import { submitLeadsAPI } from "@/api/lead.api";
import SubmitResultModal from "@/modals/SubmitResultModal";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";

// Dynamic table-based form to submit multiple leads at once. Automatically adds a nw row when the last row is filled. Allows bulk submission.

// Shape of single lead row. Each row represents one lead

interface LeadRow {
  id: number; // unique row identifier
  website: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  comments: string;
}

// Utility function - checks if all editable fields in a row are empty

const isRowEmpty = (row: LeadRow) =>
  !row.website && !row.name && !row.email && !row.phone && !row.comments;

// Creates a brand new empty row with default values.

const createEmptyRow = (id: number): LeadRow => ({
  id,
  website: "",
  name: "",
  email: "",
  countryCode: "+1",
  phone: "",
  comments: "",
});

// Placeholder API call

async function submitLeads(leads: LeadRow[]) {
  console.log("Submitting leads:", leads);
  return { success: true };
}

const SubmitLeads = () => {
  const [rows, setRows] = useState<LeadRow[]>([createEmptyRow(1)]); // all lead rows shown in table
  const [nextId, setNextId] = useState(2); // used to generate unique row IDs
  const [submitting, setSubmitting] = useState(false); // disable button while API call runs

  interface SubmitLeadResult {
    insertedCount: number;
    skippedCount: number;
    skipped: {
      name: string;
      email: string;
      website: string;
    }[];
  }

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultData, setResultData] = useState<SubmitLeadResult | null>(null);

  const COUNTRY_CODES = countries;

  //  Updates a specific field in a specific row

  const updateRow = useCallback(
    (id: number, field: keyof LeadRow, value: string) => {
      setRows((prev) => {
        let updated = prev.map((r) =>
          r.id === id ? { ...r, [field]: value } : r,
        );

        // Auto-add row when any field gets a value in the last row (and it was empty)
        const lastRow = updated[updated.length - 1];
        const prevLastRow = prev[prev.length - 1];
        if (
          id === prevLastRow.id &&
          isRowEmpty(prevLastRow) &&
          !isRowEmpty(lastRow)
        ) {
          const newId = nextId;
          setNextId((n) => n + 1);
          updated = [...updated, createEmptyRow(newId)];
        }

        // Auto-remove trailing empty rows: if a row becomes empty and there are
        // empty rows after it, trim them so only one trailing empty row remains
        while (
          updated.length > 1 &&
          isRowEmpty(updated[updated.length - 1]) &&
          isRowEmpty(updated[updated.length - 2])
        ) {
          updated = updated.slice(0, -1);
        }

        return updated;
      });
    },
    [nextId],
  );

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Submit handler - filters only filled rows, Resets table on success

  const handleSubmit = async () => {
    
    const filledRows = rows.filter(
      (r) => 
        r.website.trim() && 
        r.name.trim() && 
        r.email.trim() && 
        r.phone.trim() 
    )

    if (filledRows.length === 0) return;

    setSubmitting(true);

    try {

      const payload = filledRows.map(({ id, ...rest }) => rest);

      console.log("Leads being submitted:", payload);

      const res = await submitLeadsAPI({leads: payload});

      setResultData(res.data);
      setResultModalOpen(true);

      // Reset only if something was actually saved. If all records duplicate, then not cleared 

      if (res.data.insertedCount > 0) {
        setRows([createEmptyRow(nextId)]);
        setNextId((n) => n + 1);
      }
    } catch (error) {
      console.error("Submit leads error: ", error) ; 

      toast.error(error?.response?.data?.message || "Something went wrong while submitting leads.", ERROR_TOAST)
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <>
      <DashboardLayout title="Submit Leads">
        <div className="space-y-4">
          {/* Header */}

          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">
              Submit Leads
            </h1>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit All"}
            </button>
          </div>

          {/* Leads Table */}

          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full text-sm">
              {/* Table Header */}

              <thead>
                <tr className="border-b border-border bg-muted text-left text-xs font-medium text-muted-foreground">
                  <th className="px-2 py-2 w-8">#</th>
                  <th className="px-2 py-2 min-w-[160px]">
                    Website <span className="text-destructive">*</span>
                  </th>
                  <th className="px-2 py-2 min-w-[140px]">
                    Name <span className="text-destructive">*</span>
                  </th>
                  <th className="px-2 py-2 min-w-[160px]">
                    Email <span className="text-destructive">*</span>
                  </th>
                  <th className="px-2 py-2 min-w-[200px]">
                    Phone <span className="text-destructive">*</span>
                  </th>
                  <th className="px-2 py-2 min-w-[160px]">Comments</th>
                  <th className="px-2 py-2 w-8"></th>
                </tr>
              </thead>

              {/* Table body */}

              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-2 py-1.5 text-xs text-muted-foreground">
                      {idx + 1}
                    </td>

                    {/* Website */}

                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        placeholder="example.com"
                        value={row.website}
                        onChange={(e) =>
                          updateRow(row.id, "website", e.target.value)
                        }
                        className={inputClass}
                      />
                    </td>

                    {/* Name */}

                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(row.id, "name", e.target.value)
                        }
                        className={inputClass}
                      />
                    </td>

                    {/* Email */}

                    <td className="px-2 py-1.5">
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={row.email}
                        onChange={(e) =>
                          updateRow(row.id, "email", e.target.value)
                        }
                        className={inputClass}
                      />
                    </td>

                    {/* Phone */}

                    <td className="px-2 py-1.5">
                      <div className="flex gap-1">
                        <select
                          value={row.countryCode}
                          onChange={(e) =>
                            updateRow(row.id, "countryCode", e.target.value)
                          }
                          className="h-8 w-[7.5rem] shrink-0 rounded border border-border bg-background px-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          placeholder="555-0123"
                          value={row.phone}
                          onChange={(e) =>
                            updateRow(row.id, "phone", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </td>

                    {/* Comments */}

                    <td className="px-2 py-1.5">
                      <textarea
                        placeholder="Optional notes…"
                        value={row.comments}
                        onChange={(e) =>
                          updateRow(row.id, "comments", e.target.value)
                        }
                        rows={1}
                        className="h-8 w-full resize-none rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </td>

                    {/* Remove row */}

                    <td className="px-2 py-1.5">
                      {rows.length > 1 && (
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Remove row"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            Start typing in the Website field of the last row to auto-add a new
            one.
          </p>
        </div>
      </DashboardLayout>

      {/* Modal */}

      {resultData && (
        <SubmitResultModal
          open={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          totalSubmitted={resultData.insertedCount + resultData.skippedCount}
          successCount={resultData.insertedCount}
          duplicateCount={resultData.skippedCount}
          insertedCount={resultData.insertedCount}
          skippedCount={resultData.skippedCount}
          duplicates={resultData.skipped ?? []}
        />
      )}
    </>
  );
};

export default SubmitLeads;
