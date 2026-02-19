import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { Lock, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/api/auth.api";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";

const ResetPassword = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail") ; // email must come from previous step (localStorage / state)

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false) ; 

  // Guard: no email -> go back 

  useEffect(() => {
    if(!email) navigate("/forgot-password") ; 
  }, [email, navigate])

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    
    if(!form.password){
      toast.error("Password is required", ERROR_TOAST) ; 
      return ; 
    }

    if(form.password.length < 6){
      toast.error("Password must be at least 6 characters", ERROR_TOAST) ; 
      return ; 
    }

    if(form.password !== form.confirm){
      toast.error("Passwords do not match", ERROR_TOAST) ; 
      return ; 
    }

    try{
      setLoading(true) ; 

      const res = await resetPassword(
        email, 
        form.password,
        form.confirm
      )

      toast.success(res.data.message || "Password reset successful", SUCCESS_TOAST)

      localStorage.removeItem("resetEmail") ; // cleanup 

      navigate("/") ; // back to login 
    }catch(error){
      toast.error(error.response?.data?.message || "Something went wrong", ERROR_TOAST)
    } finally {
      setLoading(false) ; 
    }

  };

  return (
    <AuthLayout title="Set new password" subtitle="Your new password must be at least 6 characters.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <CrmInput
          label="New password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          icon={<Lock size={16} />}
        />
        <CrmInput
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          icon={<Lock size={16} />}
        />
        <CrmButton
          type="submit" 
          fullWidth
        >
          Reset Password
        </CrmButton>
        <Link to="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
