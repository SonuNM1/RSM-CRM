import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { Mail, Lock } from "lucide-react";
import { adminLogin, getMe } from "@/api/auth.api";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST, INFO_TOAST } from "@/constants/toast";
import { useAuth } from "@/context/AuthContext";
import FullPageLoader from "@/components/FullPageLoader";

const Login = () => {

  const navigate = useNavigate() ;
  const {user, loading, setUser} = useAuth() ; 

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false) ; 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const errs: Record<string, string> = {};

    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";

    setErrors(errs);

    if (Object.keys(errs).length !== 0) return;

    try {
      const res = await adminLogin(form.email, form.password, rememberMe);

      setUser(res.data.user) ; // update auth context immediately 

      toast.success("Logged in successfully", SUCCESS_TOAST);

      navigate("/dashboard", {replace: true});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid email or password", ERROR_TOAST)
    }
  };

  const handleContactAdmin = () => {
    toast.info("🚧 This feature is under development.", INFO_TOAST)
  }

  if(loading) return <FullPageLoader/>

  if(user){
    return <Navigate to="/dashboard" replace/>
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your LeadFlow account to continue."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <CrmInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          icon={<Mail size={16} />}
        />
        <CrmInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          icon={<Lock size={16} />}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-input accent-accent"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <CrmButton type="submit" fullWidth>
          Sign In
        </CrmButton>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <span 
          onClick={handleContactAdmin}
          className="font-medium text-accent cursor-pointer hover:underline">
            Contact admin
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
