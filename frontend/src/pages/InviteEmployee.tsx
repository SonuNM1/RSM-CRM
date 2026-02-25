import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { Mail, UserPlus } from "lucide-react";
import { inviteEmployee } from "@/api/auth.api";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";

const InviteEmployee = () => {
  const [form, setForm] = useState({ email: "", role: "", department: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({}); // reset API error

    console.log("form submitted");

    const errs: Record<string, string> = {}; // reset errors

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";

    if (!form.role) errs.role = "Select a role";

    if (!form.department) errs.department = "Select a department";

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      await inviteEmployee(form.email, form.role, form.department);

      setForm({ email: "", role: "", department: "" });

      toast.success("Invitation sent successfully", {
        style: {
          background: "rgba(0, 128, 0, 0.9)",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } catch (error) {
      const message = error?.response?.data?.message;

      if (message === "User already exists") {
        toast.info("This user is already part of the system", {
          style: {
            background: "rgba(59, 130, 246, 0.95)", // blue
            color: "#fff",
            fontWeight: "bold",
          },
        });
      } else {
        toast.error(message || "Failed to send invitation", SUCCESS_TOAST);
      }
      toast.error("Trouble sending invite.", ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Invite Employee">
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`w-full h-11 rounded-lg border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent transition-all
                  ${errors.role ? "border-destructive" : "border-input"}`}
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
                className={`w-full h-11 rounded-lg border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent transition-all
                  ${errors.department ? "border-destructive" : "border-input"}`}
              >
                <option value="">Select department</option>
                <option value="Email_Team">Email Team</option>
                <option value="BDE_Team">BDE Team</option>
                <option value="Engineering">Engineering</option>
                <option value="Support">Support</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department}</p>
              )}
            </div>

            <div className="pt-2">
              <CrmButton type="submit" fullWidth loading={loading}>
                {loading ? "Sending" : "Send Invitation"}
              </CrmButton>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InviteEmployee;
