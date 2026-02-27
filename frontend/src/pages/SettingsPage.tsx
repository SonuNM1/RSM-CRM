import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { User, Mail, Shield, Layers } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateMe } from "@/api/user.api";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";
import {toast} from "sonner" ; 
import FullPageLoader from "@/components/FullPageLoader";

const SettingsPage = () => {

  const { user, setUser, loading } = useAuth() ;

  const [form, setForm] = useState({
    name: "", 
    email: ""
  });

  const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short", 
    year: "numeric", 
  }) : "" ;

  // sync form when user loads / changes 

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user])

  if(loading){
    return <FullPageLoader/>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!user) return ; 

    try {
      const res = await updateMe(user._id, {
        name: form?.name 
      })

      // Update AuthContext 

      setUser(res.data.user) ; 

      toast.success("Profile updated successfully", SUCCESS_TOAST) ; 
    } catch (error) {
      console.error("Update user error: ", error.response?.data || error) ; 
      toast.error(error?.response?.data?.message || "Update failed", ERROR_TOAST) ; 
    }

  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* Profile */}
        
        <div className="bg-card rounded-xl card-shadow p-6">
          <h2 className="text-base font-display font-bold text-foreground mb-5">
            Profile Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* User header */}

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-display font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role} • Joined {joinedAt}
                </p>
              </div>
            </div>

            {/* Editable fields */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CrmInput
                label="Full Name"
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                icon={<User size={16} />
              }
              />
              <CrmInput 
                label="Email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                disabled
                className="cursor-not-allowed bg-gray-200"
                title="Email cannot be changed"
                icon={<Mail size={16} />} 
              />

              {/* Read-only fields */}

              <CrmInput 
                label="Role" 
                value={user?.role ?? ""} 
                disabled
                className="cursor-not-allowed"
                title="Role can only be changed by Super Admin"
                icon={<Shield size={16} />} 
              />
              <CrmInput 
                label="Department" 
                value={user?.department ?? ""} 
                disabled 
                className="cursor-not-allowed"
                title="Department can only be changed by Super Admin"
                icon={<Layers size={16} />} 
              />
            </div>
            <div className="flex justify-end pt-2">
              <CrmButton type="submit">Save Changes</CrmButton>
            </div>
          </form>
        </div>

        {/* Notifications */}

        {/* <div className="bg-card rounded-xl card-shadow p-6">
          <h2 className="text-base font-display font-bold text-foreground mb-4">Notifications</h2>
          <div className="space-y-3">
            {[
              { label: "Email notifications for new leads", defaultChecked: true },
              { label: "Push notifications for deal updates", defaultChecked: true },
              { label: "Weekly pipeline summary report", defaultChecked: false },
              { label: "Team activity digest", defaultChecked: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between py-2 cursor-pointer group">
                <span className="text-sm text-foreground">{item.label}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                  <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-accent transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                </div>
              </label>
            ))}
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
