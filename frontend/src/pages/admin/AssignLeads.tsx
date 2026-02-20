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
import { fetchNewLeadsAPI } from "@/api/lead.api";
import FullPageLoader from "@/components/FullPageLoader";
import { fetchLeadCreatorsAPI } from "@/api/user.api";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";

const PAGE_SIZES = [10, 25, 50];

const AssignLeads = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [assignTo, setAssignTo] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [employees, setEmployees] = useState<
    { id: string ; name: string}[]
  >([]) ; 
  
  // Options array 

  const employeeOptions = useMemo(
    () => employees.map((e) => e.name), 
    [employees]
  )

  // fetch new leads 

  useEffect(() => {
    const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await fetchNewLeadsAPI({
        page,
        limit: pageSize,
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
  }, [page, pageSize])

  // searchable select (lead creators)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetchLeadCreatorsAPI() ; 

        if(res.data.success){
          setEmployees(
            res.data.users.map((u: any) => ({
              id: u._id, 
              name: u.name, 
            }))
          ) ; 
        }
      } catch (error) {
        console.error("Failed to fetch employees: ", error) ; 
        toast.error("Searchable select won't work", ERROR_TOAST) ; 
      }
    }
    fetchEmployees() ; 
  }, [])

  // filter 

  const filtered = leads ; 

  // Pagination

  const paginated = filtered ; 

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const allVisibleSelected =
    paginated.length > 0 && paginated.every((l) => selected.has(l.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      const next = new Set(selected);
      paginated.forEach((l) => next.delete(l.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      paginated.forEach((l) => next.add(l.id));
      setSelected(next);
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected) ; 

    if(next.has(id)){
      next.delete(id) ; 
    } else {
      next.add(id) ; 
    }
    setSelected(next) ; 
  };

  const selectedCount = selected.size;

  const resetFilters = () => {
    setEmployeeFilter("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  const hasActiveFilters = employeeFilter || dateFrom || dateTo;

  const handleAssign = () => {

  }

  if(loading){
    return <FullPageLoader/>
  }

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
              options={employeeOptions}
              value={employeeFilter}
              onChange={(v) => {
                setEmployeeFilter(v) ; 
                setPage(1) 
              }}
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
                      setPage(1);
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
                      setPage(1);
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

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
                <span>{filtered.length} leads</span>
              )}
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center gap-2">

                <SearchableSelect
                  options={employeeOptions}
                  value={assignTo}
                  onChange={setAssignTo}
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
                        checked={allVisibleSelected}
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
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((lead) => (
                      <tr
                        key={lead.id}
                        className={cn(
                          "border-b border-border last:border-0 transition-colors",
                          selected.has(lead.id)
                            ? "bg-primary/[0.04]"
                            : "hover:bg-muted/30",
                        )}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selected.has(lead.id)}
                            onCheckedChange={() => toggleOne(lead.id)}
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
                          {format(new Date(lead.submittedDate), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                      </tr>
                    ))
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
                Page {safePage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
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
                <span className="font-medium text-foreground">{assignTo}</span>.
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
