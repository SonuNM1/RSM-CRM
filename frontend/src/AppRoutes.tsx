import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import AcceptInvite from "./pages/AcceptInvite";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import SubmitLeads from "./pages/SubmitLeads";
import { AllLeads } from "./pages/AllLeads";
import AssignLeads from "./pages/admin/AssignLeads";
import MyPipeline from "./pages/bde/MyPipeline";
import MyLeads from "./pages/emailTeam/MyLeads";
import Meetings from "./pages/bde/Meetings";
import BdeTimeline from "./pages/bde/BdeTimeline";
import LeadDetail from "./pages/emailTeam/LeadDetail";
import AdminLeadDetail from "./pages/admin/AdminLeadDetail";
import FollowUps from "./pages/bde/FollowUps";
import ConvertedLeads from "./pages/bde/ConvertedLeads";
import Scheduler from "./pages/bde/Scheduler";
import Analytics from "./pages/admin/Analytics";
import ManageEmployees from "./pages/admin/ManageEmployees";

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
          <Route path="/manage-employees" element={<ManageEmployees />} />
          <Route path="/assign-leads" element={<AssignLeads />} />
          <Route path="/all-leads/:leadId" element={<AdminLeadDetail />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* BDE */}

        <Route element={<ProtectedRoute allowedRoles={["BDE_Executive"]} />}>
          <Route path="/my-pipeline" element={<MyPipeline />} />
          <Route path="/my-pipeline/:leadId" element={<BdeTimeline />} />
          <Route path="/dashboard/follow-ups" element={<FollowUps />} />
          <Route
            path="/dashboard/converted-leads"
            element={<ConvertedLeads />}
          />
          <Route path="/schedule" element={<Scheduler />} />
        </Route>

        {/* Email Executive */}

        <Route element={<ProtectedRoute allowedRoles={["Email_Executive"]} />}>
          <Route path="/my-leads" element={<MyLeads />} />
          <Route path="/my-leads/:leadId" element={<LeadDetail />} />
          <Route path="/submit-leads" element={<SubmitLeads />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["BDE_Executive", "Admin", "Super_Admin"]}
            />
          }
        >
          <Route path="/meetings" element={<Meetings />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Super_Admin",
                "BDE_Executive",
                "Email_Executive",
              ]}
            />
          }
        >
          <Route path="/all-leads" element={<AllLeads />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
