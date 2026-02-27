import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserPlus,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  FilePlus,
  Inbox,
  Briefcase,
  ClipboardList,
  Send,
  Workflow,
  Presentation
} from "lucide-react";
import { logout } from "@/api/auth.api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ERROR_TOAST } from "@/constants/toast";

// Navigation items for the sidebar

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["Super_Admin", "Admin", "Email_Executive", "BDE_Executive"]
  },
  {
    label: "Invite Employee",
    icon: UserPlus,
    path: "/invite",
    roles: ["Super_Admin", "Admin"]
  },
  {
    label: "All Employees",
    icon: Users,
    path: "/all-employees",
    roles: ["Super_Admin", "Admin"]
  },
  {
    label: "Submit Leads",
    icon: FilePlus,
    path: "/submit-leads",
    roles: ["Email_Executive"]
  },
  {
    label: "All Leads",
    icon: ClipboardList,
    path: "/all-leads",
    roles: ["Admin", "Super_Admin"]
  },
  {
    label: "My Leads",
    icon: Inbox,
    path: "/my-leads",
    roles: ["Email_Executive"]
  },
  {
    label: "Assign Leads",
    icon: Send,
    path: "/assign-leads",
    roles: ["Admin", "Super_Admin"]
  },
  {
    label: "My Pipeline",
    icon: Workflow,
    path: "/my-pipeline",
    roles: ["BDE_Executive"]
  },
  {
    label: "Meetings",
    icon: Presentation,
    path: "/meetings",
    roles: ["BDE_Executive", "Admin", "Super_Admin"]
  }
];

interface DashboardLayoutProps {
  children: ReactNode; // the page content to render inside the layout
  title: string; // the title shown in the top bar
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {

  const navigate = useNavigate();

  const location = useLocation(); // for getting current URL path for active link highlighting
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const {user, loading, setUser} = useAuth() ; 
 
  // handling logout

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null) ; 

      toast.success("Logged out successfully");

      // redirect to login page

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Try again!", ERROR_TOAST);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay when sidebar is open. Clicking it closes the sidebar */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Contains logo, navigation links, and sign out */}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-crm-sidebar flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo section */}

        <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-display font-bold text-primary-foreground tracking-tight">
            LeadFlow
          </span>
          <button
            className="lg:hidden ml-auto text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links. Highlights active route */}

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-crm-sidebar-active text-accent-foreground"
                      : "text-sidebar-foreground hover:bg-crm-sidebar-hover hover:text-primary-foreground"
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section of sidebar. Sign out link */}

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-crm-sidebar-hover hover:text-primary-foreground transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area. Contains top header and page content */}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar/header */}

        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}

            <button
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Page title */}

            <h1 className="text-lg font-display font-bold text-foreground">
              {title}
            </h1>
          </div>

          {/* Right side icons */}

          <div className="flex items-center gap-3">
            {/* Search input  */}

            <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 h-9">
              <Search size={15} className="text-muted-foreground" />
              <input
                placeholder="Search..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-40"
              />
            </div>

            {/* Notifications */}

            <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-secondary">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* User profile dropdown */}

            <button 
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-secondary"
              onClick={() => navigate("/settings")}
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <User size={16} className="text-primary-foreground" />
              </div>
            </button>
          </div>
        </header>

        {/* Page content - Render children passed to layout */}

        <main className="flex-1 p-4 sm:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
