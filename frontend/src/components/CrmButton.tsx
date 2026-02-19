import { ButtonHTMLAttributes, ReactNode } from "react";

interface CrmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const CrmButton = ({
  variant = "primary",
  size = "md",
  children,
  loading,
  fullWidth,
  className = "",
  ...props
}: CrmButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-accent text-accent-foreground hover:brightness-110 focus:ring-ring shadow-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring border border-border",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-secondary focus:ring-ring",
    destructive:
      "bg-destructive text-destructive-foreground hover:brightness-110 focus:ring-destructive",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default CrmButton;
