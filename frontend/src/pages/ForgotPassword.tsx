import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { Mail, ArrowLeft } from "lucide-react";
import { requestPasswordOTP } from "@/api/auth.api";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";

const ForgotPassword = () => {

  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false) ; 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    // frontend validation 

    if (!email.trim()) { setError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Invalid email address"); return; }

    try {
      setLoading(true) ; 
      setError("") ; 

      await requestPasswordOTP(email) ; 

      toast.success("OTP sent to your email. Please check!", SUCCESS_TOAST)

      // navigate to OTP screen and pass email 

      navigate("/otp-verification", {
        state: {email}
      })

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP. Try again.", ERROR_TOAST)
    } finally {
      setLoading(false) ; 
    }

  };

  return (
    <AuthLayout title="Forgot password?" subtitle="No worries, we'll send you a reset code.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <CrmInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          error={error}
          icon={<Mail size={16} />}
        />
        <CrmButton type="submit" fullWidth>Send OTP</CrmButton>
        <Link to="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
