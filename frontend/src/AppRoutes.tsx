import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FullPageLoader from "@/components/FullPageLoader";
import Index from "./pages/Index";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import AcceptInvite from "./pages/AcceptInvite";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import InviteEmployee from "./pages/InviteEmployee";
import NotFound from "./pages/NotFound";
import SubmitLeads from "./pages/SubmitLeads";
import { AllLeads } from "./pages/AllLeads";
import AllEmployees from "./pages/admin/AllEmployees";
import AssignLeads from "./pages/admin/AssignLeads";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        
        <Route path="/" element={<Index />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/invite/accept" element={<AcceptInvite />} />

        {/* Protected */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/invite" element={<InviteEmployee />} />
          <Route path="/submit-leads" element={<SubmitLeads/>} />
          <Route path="/all-leads" element={<AllLeads/>} />
          <Route path="/all-employees" element={<AllEmployees/>} />
          <Route path="/assign-leads" element={<AssignLeads/>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
