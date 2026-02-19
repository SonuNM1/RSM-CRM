import { InputHTMLAttributes, forwardRef } from "react";

interface CrmInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const CrmInput = forwardRef<HTMLInputElement, CrmInputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-11 rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent
              transition-all duration-200
              ${icon ? "pl-10" : ""}
              ${error ? "border-destructive focus:ring-destructive/30" : ""}
              ${className}`}
            {...props}
            title={props.title} 
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

CrmInput.displayName = "CrmInput";

export default CrmInput;
