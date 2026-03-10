import { useEffect, useState } from "react";
import {
  LeadsFilters,
  type FiltersState,
} from "@/components/leads/LeadsFilters";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Lead } from "@/types/lead";
import FullPageLoader from "@/components/FullPageLoader";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";
import { ApiLead } from "@/types/api-lead";
import { LeadStatus } from "@/types/lead";
import { LeadCreator } from "@/types/user";
import { fetchLeadsAPI, fetchLeadStatusesAPI } from "@/api/lead.api";
import { fetchLeadCreatorsAPI } from "@/api/user.api";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AllLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [employees, setEmployees] = useState<LeadCreator[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const navigate = useNavigate() ; 

  // Filters state (search, status, submittedBy, date range)

  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    status: "All",
    submittedBy: "All",
    dateRange: undefined,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.status, filters.submittedBy, filters.dateRange]);

  // Selection state

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // helper that maps UI filters -> backend params

  const buildQueryParams = (filters: FiltersState, page = 1, limit = 10) => {
    const params: Record<string, any> = {
      page,
      limit,
    };

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.status !== "All") {
      params.status = filters.status;
    }

    if (filters.submittedBy !== "All") {
      params.createdBy = filters.submittedBy;
    }

    if (filters.dateRange?.from) {
      params.fromDate = filters.dateRange.from.toISOString();
    }

    if (filters.dateRange?.to) {
      params.toDate = filters.dateRange.to.toISOString();
    }

    return params;
  };

  // Fetch logic

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const params = buildQueryParams(
          { ...filters, search: debouncedSearch },
          page, 
          PAGE_SIZE,
        );

        const res = await fetchLeadsAPI(params);

        if (res.data.success) {
        setTotal(res.data.total);
        const normalizedLeads: Lead[] = res.data.leads.map((l: ApiLead) => ({
          id: l._id,
          name: l.name,
          email: l.email,
          website: l.website,
          submittedBy: l.createdBy?.name ?? "—",
          submittedDate: l.createdAt,
          status: l.status ?? "New",
        }));
        setLeads(normalizedLeads);
      }
      } catch (error) {
        console.error("Fetch leads error: ", error);
        toast.error("Something went wrong while loading leads.", ERROR_TOAST);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [page, debouncedSearch, filters.status, filters.submittedBy, filters.dateRange]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [statusRes, usersRes] = await Promise.all([
          fetchLeadStatusesAPI(),
          fetchLeadCreatorsAPI(),
        ]);

        if (statusRes.data.success) {
          setStatuses(statusRes.data.statuses);
        }

        if (usersRes.data.success) {
          setEmployees(usersRes.data.users);
        }
      } catch (error) {
        console.error("Filters error: ", error);
        toast.error("Failed to load filters", ERROR_TOAST);
      }
    };
    fetchMeta();
  }, []);

  // When filters change: update filters, Reset pagination to page 1

  const handleFilterChange = (f: FiltersState) => {
    setFilters(f);
  };

  return (
    <DashboardLayout title="All Leads">
      <div className="min-h-screen bg-background">
        <div className="px-6 py-8 w-full">
          <div className="mb-1 flex items-center gap-3"></div>

          {/* Filters */}

          <div className="mb-5">
            <LeadsFilters
              filters={filters}
              onChange={handleFilterChange}
              statuses={statuses}
              employees={employees} // temporary
            />
          </div>

          {/* Leads Table */}

          <LeadsTable
            leads={leads}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={(id) => navigate(`/all-leads/${id}`)} 
            loading={loading}
          />
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between mt-4">
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
