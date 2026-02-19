import { useEffect, useState } from "react";
import {
  LeadsFilters,
  type FiltersState,
} from "@/components/leads/LeadsFilters";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Lead } from "@/types/lead";
import FullPageLoader from "@/components/FullPageLoader";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";
import { ApiLead } from "@/types/api-lead";
import { LeadStatus } from "@/types/lead";
import { LeadCreator } from "@/types/user";
import { fetchLeadStatusesAPI, fetchLeadsAPI } from "@/api/lead.api";
import { fetchLeadCreatorsAPI } from "@/api/user.api";
import { useDebounce } from "@/hooks/useDebounce";

export const AllLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [employees, setEmployees] = useState<LeadCreator[]>([]);

  // Filters state (search, status, submittedBy, date range)

  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    status: "All",
    submittedBy: "All",
    dateRange: undefined,
  });

  const debouncedSearch = useDebounce(filters.search, 500) ; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        const params = buildQueryParams({
          ...filters,
          search: debouncedSearch
        });

        const res = await fetchLeadsAPI(params);

        if (res.data.success) {
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
  }, [
    debouncedSearch, 
    filters.status, 
    filters.submittedBy, 
    filters.dateRange
  ]);

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

  if (loading) {
    return <FullPageLoader />;
  }

  // When filters change: update filters, Reset pagination to page 1

  const handleFilterChange = (f: FiltersState) => {
    setFilters(f);
  };

  return (
    <DashboardLayout title="All Leads">
      <div className="min-h-screen bg-background">
        <div className="px-6 py-8 w-full">
          <div className="mb-6 flex items-center gap-3">
            {/* Page Header */}

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Leads
              </h1>
              <p className="text-sm text-muted-foreground">
                {leads.length} total leads
              </p>
            </div>
          </div>

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
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
