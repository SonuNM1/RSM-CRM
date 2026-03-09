import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Search, Mail, UserPlus } from "lucide-react";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { fetchEmployeesAPI } from "@/api/user.api";
import { inviteEmployee } from "@/api/auth.api";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Super_Admin" | "Admin" | "Email_Executive" | "BDE_Executive";
  department: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
}

const roleStyles: Record<Employee["role"], string> = {
  Super_Admin: "bg-violet-100 text-violet-700",
  Admin: "bg-blue-100 text-blue-700",
  Email_Executive: "bg-orange-100 text-orange-700",
  BDE_Executive: "bg-emerald-100 text-emerald-700",
};

const getStatusUI = (status: Employee["status"]) => {
  if (status === "ACTIVE")
    return { label: "Active", text: "text-emerald-600", dot: "bg-emerald-500" };
  return {
    label: "Inactive",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/50",
  };
};

const ManageEmployees = () => {
  // --- all employees state ---
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  // --- invite state ---
  const [form, setForm] = useState({ email: "", role: "", department: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingInvite, setLoadingInvite] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const res = await fetchEmployeesAPI(debouncedSearch);
        setEmployees(res.data.data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [debouncedSearch]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (!form.role) errs.role = "Select a role";
    if (!form.department) errs.department = "Select a department";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoadingInvite(true);
      await inviteEmployee(form.email, form.role, form.department);
      setForm({ email: "", role: "", department: "" });
      toast.success("Invitation sent successfully", SUCCESS_TOAST);
    } catch (error) {
      const message = error?.response?.data?.message;
      if (message === "User already exists") {
        toast.info("This user is already part of the system", {
          style: {
            background: "rgba(59, 130, 246, 0.95)",
            color: "#fff",
            fontWeight: "bold",
          },
        });
      } else {
        toast.error(message || "Failed to send invitation", ERROR_TOAST);
      }
    } finally {
      setLoadingInvite(false);
    }
  };

  return (
    <DashboardLayout title="Manage Employees">
      <Tabs defaultValue="all">
        <TabsList className="mb-6 gap-6">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#19B3A6] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            All Employees
          </TabsTrigger>
          <span
            style={{ color: "#19B3A6" }}
            className="text-lg font-light select-none"
          >
            |
          </span>
          <TabsTrigger
            value="invite"
            className="data-[state=active]:bg-[#19B3A6] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Invite Employee
          </TabsTrigger>
        </TabsList>

        {/* All Employees Tab */}
        <TabsContent value="all">
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-lg border bg-card overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEmployees ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        Loading employees...
                      </TableCell>
                    </TableRow>
                  ) : employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
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
                              className={`font-normal pointer-events-none ${roleStyles[emp.role]}`}
                            >
                              {emp.role.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(emp.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </TableCell>
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
        </TabsContent>

        {/* Invite Employee Tab */}
        <TabsContent value="invite">
          <div className="max-w-lg">
            <div className="bg-card rounded-xl card-shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 className="text-base font-display font-bold text-foreground">
                    Invite a team member
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    They'll receive an email invitation to join.
                  </p>
                </div>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <CrmInput
                  label="Email address"
                  type="email"
                  placeholder="colleague@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  icon={<Mail size={16} />}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className={`w-full h-11 rounded-lg border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent transition-all ${errors.role ? "border-destructive" : "border-input"}`}
                  >
                    <option value="">Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="Email_Executive">Email Executive</option>
                    <option value="BDE_Executive">BDE</option>
                  </select>
                  {errors.role && (
                    <p className="text-xs text-destructive">{errors.role}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className={`w-full h-11 rounded-lg border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent transition-all ${errors.department ? "border-destructive" : "border-input"}`}
                  >
                    <option value="">Select department</option>
                    <option value="Email_Team">Email Team</option>
                    <option value="BDE_Team">BDE Team</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Support">Support</option>
                    <option value="Operations">Operations</option>
                  </select>
                  {errors.department && (
                    <p className="text-xs text-destructive">
                      {errors.department}
                    </p>
                  )}
                </div>
                <div className="pt-2">
                  <CrmButton type="submit" fullWidth loading={loadingInvite}>
                    {loadingInvite ? "Sending" : "Send Invitation"}
                  </CrmButton>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManageEmployees;
