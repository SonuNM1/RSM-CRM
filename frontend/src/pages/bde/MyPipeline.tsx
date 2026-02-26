import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Lead } from "@/types/lead";
import { useDebounce } from "@/hooks/useDebounce";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";
import { toast } from "sonner";
import { ApiLead } from "@/types/api-lead";
import { fetchLeadStatusesAPI, getMyPipelineLeadsAPI } from "@/api/lead.api";
import { LeadStatus } from "@/types/lead";
import { format } from "date-fns";
import { updateLeadStatusAPI } from "@/api/lead.api";
import { BDE_STATUSES, ADMIN_ONLY_STATUSES } from "@/constants/leadStatus";
import { useAuth } from "@/context/AuthContext";
import { LEAD_STATUS_COLORS } from "@/constants/leadStatus";
import { StatusBadge } from "@/components/leads/StatusBadge";

const ITEMS_PER_PAGE = 14;

const MyPipeline = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    dateRange: undefined as { from?: Date; to?: Date } | undefined,
  });

  const { user } = useAuth();

  const debouncedSearch = useDebounce(filters.search, 500);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(leads.length / ITEMS_PER_PAGE));

  const paginated = leads.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const start = leads.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(page * ITEMS_PER_PAGE, leads.length);

  const buildQueryParams = () => {
    const params: Record<string, any> = {};

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    if (filters.status !== "All") {
      params.status = filters.status;
    }

    if (filters.dateRange?.from) {
      params.fromDate = filters.dateRange.from.toISOString();
    }

    if (filters.dateRange?.to) {
      params.toDate = filters.dateRange.to.toISOString();
    }

    return params;
  };

  useEffect(() => {
    console.log("useEffect fired");

    const fetchLeads = async () => {
      try {
        setLoading(true);

        const params = buildQueryParams();
        const res = await getMyPipelineLeadsAPI(params);

        if (res.data.success) {
          const normalized: Lead[] = res.data.leads.map((l: ApiLead) => ({
            id: l._id,
            name: l.name,
            email: l.email,
            website: l.website,
            phone: l.phone,
            status: l.status ?? "New",
            assignedBy: l.createdBy?.name ?? "—",
            assignedAt: l.assignedAt ?? null,
          }));

          setLeads(normalized);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load pipeline", ERROR_TOAST);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [debouncedSearch, filters.status, filters.dateRange]);

  useEffect(() => {
    fetchLeadStatusesAPI()
      .then((res) => {
        if (res.data.success) setStatuses(res.data.statuses);
      })
      .catch(() => toast.error("Failed to load statuses", ERROR_TOAST));
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await updateLeadStatusAPI(leadId, newStatus);
      if (res.data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId ? { ...l, status: newStatus as LeadStatus } : l,
          ),
        );
        toast.success("Status updated", SUCCESS_TOAST);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to update status",
        ERROR_TOAST,
      );
    }
  };

  return (
    <DashboardLayout title="My Pipeline">
      <div className="p-1 sm:p-6 lg:p-8">
        
        {/* Filters */}

        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="Search name, email, website…"
              className="pl-9"
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(v) => {
              setFilters((f) => ({ ...f, status: v }));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-44">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  dateRange: {
                    ...f.dateRange,
                    from: e.target.value ? new Date(e.target.value) : undefined,
                  },
                }))
              }
              className="w-auto"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="date"
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  dateRange: {
                    ...f.dateRange,
                    to: e.target.value ? new Date(e.target.value) : undefined,
                  },
                }))
              }
              className="w-auto"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Name
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">
                    Website
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">
                    Phone
                  </th>
                  {/* <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                    Assigned By
                  </th> */}
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                    Assigned Date
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 w-36">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {lead.website?.replace("https://", "")}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {lead?.phone}
                    </td>
                    {/* <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {lead.assignedBy ?? "—"}
                    </td> */}
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {lead.assignedAt
                        ? format(new Date(lead.assignedAt), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 w-36">
                      <div className="relative w-fit">
                        <StatusBadge status={lead.status} />
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                          {BDE_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                          {ADMIN_ONLY_STATUSES.map((s) => (
                            <option
                              key={s}
                              value={s}
                              disabled={user?.role === "BDE_Executive"}
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {start}–{end} of {leads.length} leads
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyPipeline;
