import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import CrmButton from "@/components/CrmButton";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { validatePasswordOTP } from "@/api/auth.api";
import { toast } from "sonner";
import { INFO_TOAST } from "@/constants/toast";

const OtpVerification = () => {

  const navigate = useNavigate();
  const location = useLocation() ; 

  // OTP page opens only if email exists. Direct URL access blocked. 

  useEffect(() => {
    if(!location.state?.email){
      navigate("/forgot-password", {replace: true})
    }
  }, [])

  const email = location.state?.email ; // email should come from ForgotPaswword page 
  
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
  
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!email){
      setError("Email missing. Please restart password reset.")
      return ; 
    }

    if(otp.some((d) => !d)){
      setError("Please enter the complete code.") ; 
      return ; 
    }

    try {
      const otpValue = otp.join("") ; 

      await validatePasswordOTP(email, otpValue) ; 

      toast.success("OTP verified successfully", {
        style: {
          background: "rgba(0, 128, 0, 0.9)", 
          color: "#fff", 
          fontWeight: "bold"
        }
      }) ; 

      localStorage.setItem("resetEmail", email) ; // setting email in localstorage 

      navigate("/reset-password", {
        state: {email}
      })

    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP")
    }

  };

  return (
    <AuthLayout title="Verify your identity" subtitle="Enter the 6-digit code sent to your email.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-display font-bold rounded-lg border bg-card text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent transition-all
                  ${error ? "border-destructive" : "border-input"}`}
              />
            ))}
          </div>
          {error && <p className="text-xs text-destructive text-center mt-2">{error}</p>}
        </div>

        <CrmButton type="submit" fullWidth>Verify Code</CrmButton>

        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            type="button" 
            className="font-medium text-accent hover:underline"
            onClick={() => toast.info("🚧 Resend OTP feature is under development.", INFO_TOAST)}
          >
            Resend
          </button>
        </p>

        <Link to="/forgot-password" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back
        </Link>
      </form>
    </AuthLayout>
  );
};

export default OtpVerification;
