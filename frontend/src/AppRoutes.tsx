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
import MyPipeline from "./pages/bde/MyPipeline";
import MyLeads from "./pages/emailTeam/MyLeads";
import BdeDashboard from "./pages/Dashboard/BdeDashboard";
import SuperAdminDashboard from "./pages/Dashboard/SuperAdminDashboard";
import Meetings from "./pages/Meetings";

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

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Admin + Super Admin */}

        <Route
          element={<ProtectedRoute allowedRoles={["Admin", "Super_Admin"]} />}
        >
          <Route path="/invite" element={<InviteEmployee />} />
          <Route path="/all-employees" element={<AllEmployees />} />
          <Route path="/assign-leads" element={<AssignLeads />} />
        </Route>

        {/* BDE */}

        <Route element={<ProtectedRoute allowedRoles={["BDE_Executive"]} />}>
          <Route path="/my-pipeline" element={<MyPipeline />} />
        </Route>

        {/* Email Executive */}

        <Route element={<ProtectedRoute allowedRoles={["Email_Executive"]} />}>
          <Route path="/my-leads" element={<MyLeads />} />
          <Route path="/submit-leads" element={<SubmitLeads />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Super_Admin", "BDE_Executive", "Email_Executive"]}
            />
          }
        >
          <Route path="/all-leads" element={<AllLeads />} />
          <Route path="/meetings" element={<Meetings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
