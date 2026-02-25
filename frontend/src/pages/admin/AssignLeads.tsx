import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo, useEffect } from "react";
import { StatusBadge } from "@/components/leads/StatusBadge";
import SearchableSelect from "@/components/leads/SearchableSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Lead } from "@/types/lead";
import { assignLeadsAPI, fetchNewLeadsAPI } from "@/api/lead.api";
import FullPageLoader from "@/components/FullPageLoader";
import { fetchUsersForFilterAPI } from "@/api/user.api";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";

const PAGE_SIZES = [10, 25, 50];

const AssignLeads = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Applied filters (used only when Filter button is clicked)

  const [appliedEmployeeFilter, setAppliedEmployeeFilter] = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState<Date | undefined>();
  const [appliedDateTo, setAppliedDateTo] = useState<Date | undefined>();

  const [assignTo, setAssignTo] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [submittedByUsers, setSubmittedByUsers] = useState([]);
  const [assignToUsers, setAssignToUsers] = useState([]);

  // Options array

  const submittedByOptions = useMemo(
    () =>
      submittedByUsers.map((e) => ({
        label: e.name,
        value: e.id,
      })),
    [submittedByUsers],
  );

  const assignToOptions = useMemo(
    () =>
      assignToUsers.map((e) => ({
        label: e.name,
        value: e.id,
      })),
    [assignToUsers],
  );

  // fetch new leads

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const response = await fetchNewLeadsAPI({
          page,
          limit: pageSize,
          createdBy: appliedEmployeeFilter || undefined,
          dateFrom: appliedDateFrom,
          dateTo: appliedDateTo,
        });

        const data = response.data;

        if (data.success) {
          setLeads(data.leads);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Failed to fetch new leads", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, pageSize, appliedEmployeeFilter, appliedDateFrom, appliedDateTo]);

  // searchable select (users)

  useEffect(() => {
    const fetchDropdownUsers = async () => {
      try {
        const [submittedRes, assignRes] = await Promise.all([
          fetchUsersForFilterAPI("submittedBy"),
          fetchUsersForFilterAPI("assignTo"),
        ]);

        if (submittedRes.data.success) {
          setSubmittedByUsers(
            submittedRes.data.users.map((u: any) => ({
              id: u._id, 
              name: u.name,
            })),
          );
        }

        if (assignRes.data.success) {
          setAssignToUsers(
            assignRes.data.users.map((u: any) => ({
              id: u._id, 
              name: u.name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch dropdown users:", error);
        toast.error("Searchable select won't work", ERROR_TOAST);
      }
    };
    fetchDropdownUsers();
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const allVisibleSelected =
    leads.length > 0 && selected.length === leads.length;

  const someVisibleSelected =
    selected.length > 0 && selected.length < leads.length;

  const isIndeterminate = someVisibleSelected;

  const toggleAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      setSelected(leads.map((l) => l.id));
    } else {
      setSelected([]);
    }
  };

  const selectedCount = selected.length;

  const resetFilters = () => {
    // UI state

    setEmployeeFilter("");
    setDateFrom(undefined);
    setDateTo(undefined);

    // Applied state

    setAppliedEmployeeFilter("");
    setAppliedDateFrom(undefined);
    setAppliedDateTo(undefined);

    setPage(1);
  };

  const handleAssign = async () => {
    console.log("Selected:", selected);
    console.log("AssignTo:", assignTo);

    try {
      const leadIds = Array.from(selected);

      console.log("LeadIds being sent:", leadIds);

      const response = await assignLeadsAPI({
        leadIds,
        assignedTo: assignTo,
      });

      console.log("API Response:", response);

      if (response.data.success) {
        toast.success("Leads assigned successfully", SUCCESS_TOAST);

        // Reset UI
        setSelected([]);
        setAssignTo("");
        setShowConfirm(false);

        // Refetch leads
        setPage(1);
      }
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error("Failed to assign leads", ERROR_TOAST);
    }
  };

  const hasActiveFilters =
    appliedEmployeeFilter || appliedDateFrom || appliedDateTo;

  if (loading) {
    return <FullPageLoader />;
  }

  console.log("Selected Employee (assignTo):", assignTo);
  console.log("Selected Leads Count:", selected.length);

  return (
    <DashboardLayout title="Assign Leads">
      <div className="min-h-screen bg-background">
        <div className="px-6 py-1 w-full">
          {/* Header */}

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground"></h1>
            </div>
          </div>

          {/* Filters */}

          <div className="mb-4 flex flex-wrap items-end gap-3">
            <SearchableSelect
              options={submittedByOptions}
              value={employeeFilter}
              onChange={setEmployeeFilter}
              placeholder="Select employee"
              label="Submitted By"
              className="w-56"
            />

            {/* Date From */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                From
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal h-9",
                      !dateFrom && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(d) => {
                      setDateFrom(d);
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                To
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal h-9",
                      !dateTo && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dateTo ? format(dateTo, "MMM d, yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(d) => {
                      setDateTo(d);
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              size="sm"
              className="h-9"
              disabled={!employeeFilter && !dateFrom && !dateTo}
              onClick={() => {
                setAppliedEmployeeFilter(employeeFilter);
                setAppliedDateFrom(dateFrom);
                setAppliedDateTo(dateTo);
                setPage(1);
              }}
            >
              Filter
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>

          {/* Action Bar */}

          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedCount > 0 ? (
                <span className="font-medium text-foreground">
                  {selectedCount} lead{selectedCount !== 1 ? "s" : ""} selected
                </span>
              ) : (
                <span>{total} new leads</span>
              )}
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <SearchableSelect
                  options={assignToOptions}
                  value={assignTo}
                  onChange={(val) => {
                    console.log("assignTo changed: ", val);
                    setAssignTo(val);
                  }}
                  placeholder="Assign to employee"
                  className="w-56"
                />
                <Button
                  disabled={!assignTo}
                  onClick={() => setShowConfirm(true)}
                  className="h-9"
                >
                  Assign
                </Button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 sticky top-0">
                    <th className="w-12 px-4 py-3">
                      <Checkbox
                        checked={
                          allVisibleSelected
                            ? true
                            : someVisibleSelected
                              ? "indeterminate"
                              : false
                        }
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Website
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Submitted By
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Submitted Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr key="empty">
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      console.log("ROW", lead.id, selected.includes(lead.id));
                      console.log("leads: ", leads);
                      return (
                        <tr
                          key={lead.id}
                          className={cn(
                            "border-b border-border last:border-0 transition-colors",
                            selected.includes(lead.id)
                              ? "bg-primary/[0.04]"
                              : "hover:bg-muted/30",
                          )}
                        >
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={selected.includes(lead.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelected((prev) => [...prev, lead.id]);
                                } else {
                                  setSelected((prev) =>
                                    prev.filter((id) => id !== lead.id),
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {lead.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {lead.email}
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {lead.website.replace("https://", "")}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {lead.submittedBy}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {format(
                              new Date(lead.submittedDate),
                              "MMM d, yyyy",
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={lead.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 rounded-md border border-input bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="mr-3 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0"
              >
                ›
              </Button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Assignment</DialogTitle>
              <DialogDescription>
                You are assigning{" "}
                <span className="font-medium text-foreground">
                  {selectedCount} lead{selectedCount !== 1 ? "s" : ""}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {assignToOptions.find((o) => o.value === assignTo)?.label}
                </span>
                .
                <br />
                Do you want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign}>Confirm Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AssignLeads;
