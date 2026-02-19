import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import CrmInput from "@/components/CrmInput";
import CrmButton from "@/components/CrmButton";
import { User, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { acceptInvite, verifyInviteToken } from "@/api/auth.api";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";

/*
This page is opened when a user clicks the invite link from email

1. Read invite token from URL
2. Verify token with backend
3. Show form to set name & password
4. Activate account 
*/

const AcceptInvite = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token"); // toke comes from URL: /invite/accept?token=abc123

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form state

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  // verifying invite token when page loads -> if invalid/expired, redirect to login

  useEffect(() => {
    const verifyInvite = async () => {
      if (!token) {
        toast.error("Invalid invite link", {
          style: {
            background: "rgba(220, 38, 38, 0.95)",
            color: "#fff",
            fontWeight: "bold",
          },
        });
        navigate("/") ; 
        return ; 
      }
      try {
        await verifyInviteToken(token) ; 
        setLoading(false) ; 
      } catch (error) {
        toast.error(
            error.response?.data?.message || "Invite link is invalid or expired",
            {
                style: {
                    background: "rgba(220, 38, 38, 0.95)", 
                    color: "#fff", 
                    fontWeight: "bold"
                }
            }
        ) ; 
        navigate("/") ; 
      }
    };
    verifyInvite() ; 
  }, [token, navigate]);

  // Activate account 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side guardrails (toast only)

    if(!form.name.trim()){
        toast.error("Name is required", ERROR_TOAST) ; 
        return ; 
    }

    if (!form.password) {
      toast.error("Password is required", ERROR_TOAST);
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters", ERROR_TOAST);
      return;
    }

    try {
      setSubmitting(true);

      await acceptInvite(token!, form.name, form.password) ; 

      toast.success("Account activated successfully. Please login.", 
        SUCCESS_TOAST
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to activate account",
        ERROR_TOAST
      );
    } finally {
      setSubmitting(false);
    }
  };

  // while verifying token

  if (loading) {
    return (
      <AuthLayout title="Verifying invite" subtitle="Please wait...">
        <p className="text-sm text-muted-foreground text-center">
          Checking invitation validity
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Complete your registration"
      subtitle="Set up your account to get started."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <CrmInput
          label="Full name"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          icon={<User size={16} />}
        />

        <CrmInput
          label="Set password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          icon={<Lock size={16} />}
        />

        <CrmButton type="submit" fullWidth loading={submitting}>
          Activate Account
        </CrmButton>

        <p className="text-center text-sm text-muted-foreground">
          Already activated?{" "}
          <span
            onClick={() => navigate("/")}
            className="font-medium text-accent cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default AcceptInvite;
