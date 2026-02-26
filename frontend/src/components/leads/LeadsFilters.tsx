import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import type { LeadStatus } from "@/types/lead";
import { LeadCreator } from "@/types/user";

interface FiltersState {
  search: string;
  status: LeadStatus | "All";
  submittedBy: string;
  dateRange: DateRange | undefined;
}

interface LeadsFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  statuses: LeadStatus[];
  employees: LeadCreator[];
}

export function LeadsFilters({
  filters,
  onChange,
  statuses,
  employees,
}: LeadsFiltersProps) {
  // draft state (user edits)

  const [draft, setDraft] = useState<Omit<FiltersState, "search">>({
    status: filters.status,
    submittedBy: filters.submittedBy,
    dateRange: filters.dateRange,
  });

  const [search, setSearch] = useState(filters.search);

  // sync draft when parent filters change (!important)

  useEffect(() => {
    setDraft({
      status: filters.status,
      submittedBy: filters.submittedBy,
      dateRange: filters.dateRange,
    });
  }, [filters.status, filters.submittedBy, filters.dateRange]);

  const hasFilters =
    draft.status !== "All" || draft.submittedBy !== "All" || draft.dateRange;

  const handleApply = () => {
    onChange({
      ...filters,
      status: draft.status,
      submittedBy: draft.submittedBy,
      dateRange: draft.dateRange,
    });
  };

  const handleClear = () => {
    const cleared: FiltersState = {
      search: "",
      status: "All",
      submittedBy: "All",
      dateRange: undefined,
    };

    setDraft(cleared);
    onChange(cleared);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Search */}

      <Input
        value={search}
        onChange={(e) => {
          const val = e.target.value ; 
          setSearch(val) ; 
          onChange({...filters, search: val})
        }}
        className="w-64"
        placeholder="Search name, website or email"
      />

      {/* Status */}

      <Select
        value={draft.status}
        onValueChange={(v) =>
          setDraft((d) => ({ ...d, status: v as LeadStatus | "All" }))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>http://localhost:8080/invite
          <SelectItem value="All">All Statuses</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Submitted By */}

      <Select
        value={draft.submittedBy}
        onValueChange={(v) => setDraft((d) => ({ ...d, submittedBy: v }))}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Submitted By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Employees</SelectItem>
          {employees.map((e) => (
            <SelectItem key={e._id} value={e._id}>
              {e.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-56 justify-start text-left font-normal",
              !draft.dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {draft.dateRange?.from
              ? draft.dateRange.to
                ? `${format(draft.dateRange.from, "MMM d")} – ${format(draft.dateRange.to, "MMM d")}`
                : format(draft.dateRange.from, "MMM d, yyyy")
              : "Date range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={draft.dateRange}
            onSelect={(range) => setDraft((d) => ({ ...d, dateRange: range }))}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Action buttons */}

      <div className="flex items-center gap-2 ml-24">
        {/* Apply Button */}

        <Button onClick={handleApply} variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Apply
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft({
                status: "All",
                submittedBy: "All",
                dateRange: undefined,
              });

              onChange({
                search: "",
                status: "All",
                submittedBy: "All",
                dateRange: undefined,
              });
            }}
          >
            <X className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export type { FiltersState };
