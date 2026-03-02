import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { ERROR_TOAST } from "@/constants/toast";
import { toast } from "sonner";
import { getMyLeadsAPI } from "@/api/lead.api";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 15; // no of leads to show per page

const MyLeads = () => {
  const navigate = useNavigate();

  // Filter state

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>(); // local draft

  // pagination state

  const [page, setPage] = useState(1); // current page number

  // Data state

  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE)); // total page count bassed on API-reported total

  // when filters change reset to page 1

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateRange]);

  // fetch leads from API

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const { data } = await getMyLeadsAPI({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch.trim() || undefined,
          dateFrom: dateRange?.from?.toISOString(),
          dateTo: dateRange?.to?.toISOString(),
        });
        if (data.success) {
          setLeads(data.leads);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Error fetching my leads:", error);
        toast.error(
          "Failed to load leads. Please try again later.",
          ERROR_TOAST,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, debouncedSearch, dateRange]);

  const hasFilters = search || dateRange;

  return (
    <DashboardLayout title="My Leads">
      <div className="p-6 space-y-5">
        {/* Filters */}

        <div className="flex flex-wrap items-center gap-3">
          {/* Search input - filters by name, email or website */}

          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search by name, email or website…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Date range picker */}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-56 justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
                    : format(dateRange.from, "MMM d, yyyy")
                  : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={draftDateRange}
                onSelect={setDraftDateRange}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Apply button — sits right next to the date picker */}

          {draftDateRange?.from && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDateRange(draftDateRange)}
            >
              <Filter className="mr-2 h-4 w-4" /> Apply
            </Button>
          )}

          {(search || dateRange) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1 text-sm text-muted-foreground"
              onClick={() => {
                setSearch("");
                setDateRange(undefined);
                setDraftDateRange(undefined); // ← also clear draft
              }}
            >
              <X size={14} /> Clear
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Name
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Email
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Website
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Phone
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      {hasFilters
                        ? "No leads found matching your filters."
                        : "No leads submitted yet. Go to Submit Lead section to add your first lead."}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/my-leads/${lead._id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 text-primary">{lead.website}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {lead.createdAt
                          ? format(new Date(lead.createdAt), "MMM d, yyyy")
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={14} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyLeads;
