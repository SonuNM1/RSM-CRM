import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/pipeline/StatusBadge";
import LeadDetailView from "@/components/pipeline/LeadDetailView";
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
import { format } from "date-fns";
import { Lead } from "@/types/lead";
import { useDebounce } from "@/hooks/useDebounce";
import { ERROR_TOAST } from "@/constants/toast";
import { toast } from "sonner";
import { ApiLead } from "@/types/api-lead";
import { getMyPipelineLeadsAPI } from "@/api/lead.api";

const ITEMS_PER_PAGE = 8;

const MyPipeline = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    dateRange: undefined as { from?: Date; to?: Date } | undefined,
  });

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
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const params = buildQueryParams() ; 
        const res = await getMyPipelineLeadsAPI(params);

        if (res.data.success) {
          const normalized: Lead[] = res.data.leads.map((l: ApiLead) => ({
            id: l._id,
            name: l.name,
            email: l.email,
            website: l.website,
            phone: l.phone,
            status: l.status ?? "New",
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
  }, [debouncedSearch, filters.status, filters.dateRange, page]);

  return (
    <DashboardLayout title="My Pipeline">
      <div className="p-1 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, website…"
              onChange={(e) => {}}
              className="pl-9"
            />
          </div>
          <Select
            onValueChange={(v) => {
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-44">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              onChange={(e) => {
                setPage(1);
              }}
              className="w-auto"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="date"
              onChange={(e) => {
                setPage(1);
              }}
              className="w-auto"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                    Assigned By
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                    Assigned Date
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
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
