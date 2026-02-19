import { ReactNode } from "react";
import authBg from "@/assets/auth-bg.jpg";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] auth-gradient relative overflow-hidden flex-col justify-between p-8 xl:p-10">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-display font-bold text-primary-foreground tracking-tight">LeadFlow</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 py-6">
          <img
            src={authBg}
            alt="CRM Analytics"
            className="w-full max-w-[280px] xl:max-w-xs object-contain opacity-90 teal-glow rounded-2xl"
          />
          <div className="text-center max-w-sm">
            <h2 className="text-xl xl:text-2xl font-display font-bold text-primary-foreground leading-tight mb-2">
              Manage leads smarter,<br />close deals faster.
            </h2>
            <p className="text-xs xl:text-sm text-primary-foreground/60 leading-relaxed">
              Track your pipeline, automate outreach, and turn prospects into loyal customers — all in one place.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-center gap-8">
            {[
              { label: "Active Leads", value: "12.4K" },
              { label: "Conversion", value: "34%" },
              { label: "Revenue", value: "$2.8M" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-display font-bold text-accent">{stat.value}</p>
                <p className="text-xs text-primary-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/3 translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-display font-bold text-foreground">LeadFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
