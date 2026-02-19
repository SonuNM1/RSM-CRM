import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchEmployeesAPI } from "@/api/user.api";
import { useDebounce } from "@/hooks/useDebounce";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Super_Admin" | "Admin" | "Email_Executive" | "BDE_Executive";
  department: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
}

const roleBadgeVariant: Record<
  Employee["role"],
  "default" | "secondary" | "outline"
> = {
  Super_Admin: "default",
  Admin: "secondary",
  Email_Executive: "outline",
  BDE_Executive: "outline",
};

const AllEmployees = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500) ; 

  // Fetch employees
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true) ; 
        const res = await fetchEmployeesAPI(debouncedSearch);
        setEmployees(res.data.data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [debouncedSearch]);

  // Status mapper

  const getStatusUI = (status: Employee["status"]) => {
    if (status === "ACTIVE") {
      return {
        label: "Active",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      };
    }
    return {
      label: "Inactive",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground/50",
    };
  };

  return (
    <DashboardLayout title="All Employees">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
        </p>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => {
                  const status = getStatusUI(emp.status);

                  return (
                    <TableRow key={emp._id}>
                      <TableCell className="font-medium">
                        {emp.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {emp.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={roleBadgeVariant[emp.role]}
                          className="font-normal"
                        >
                          {emp.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllEmployees;
