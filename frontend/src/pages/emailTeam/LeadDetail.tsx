import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Mail,
  Globe,
  Phone,
  Calendar,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ERROR_TOAST } from "@/constants/toast";
import { Lead } from "@/types/lead";
import FullPageLoader from "@/components/FullPageLoader";
import { getMyLeadByIdAPI } from "@/api/lead.api";

// ── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ── Main Component ───────────────────────────────────────────────────────────

const LeadDetail = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      try {
        const { data } = await getMyLeadByIdAPI(leadId!);
        if (data.success) setLead(data.lead);
      } catch {
        toast.error("Failed to load lead details.", ERROR_TOAST);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId]);

  // ── Loading state ──

  if (loading) {
    return <FullPageLoader />;
  }

  const handleUpdate = () => {
    toast.info("Feature under development — coming soon!");
  };

  const handleDelete = () => {
    toast.info("Feature under development — coming soon!");
  };

  // ── Not found state ──

  if (!lead) {
    return (
      <DashboardLayout title="Lead Detail">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground text-sm">
          <p>Lead not found.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/my-leads")}
          >
            Back to My Leads
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Lead Detail">
      {/* Full-height flex column so the two-column row can fill remaining space */}
      <div className="p-6 flex flex-col h-full">
        {/* Back navigation */}
        <button
          onClick={() => navigate("/my-leads")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 w-fit"
        >
          <ChevronLeft size={16} /> Back to My Leads
        </button>

        {/* Two-column row — min-h-0 is required so flex children can scroll */}
        <div className="flex gap-5 flex-1 min-h-0">
          {/* ── LEFT COLUMN (40%) ── */}
          <div className="w-[40%] shrink-0 flex flex-col gap-4">
            {/* Lead info card */}
            <div className="rounded-xl border bg-card p-5 flex flex-col gap-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center rounded-full w-12 h-12 shrink-0 text-white font-semibold text-base ${getAvatarColor(lead.name)}`}
                >
                  {getInitials(lead.name)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base leading-tight">
                    {lead.name}
                  </p>
                </div>
              </div>

              <hr className="border-border" />

              {/* Contact details */}

              {/* Contact details — 2x2 grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  icon={<Mail size={14} />}
                  label="Email"
                  value={
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-primary hover:underline"
                    >
                      {lead.email}
                    </a>
                  }
                />
                <InfoRow
                  icon={<Globe size={14} />}
                  label="Website"
                  value={
                    lead.website ? (
                      <a
                        href={
                          lead.website.startsWith("http")
                            ? lead.website
                            : `https://${lead.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {lead.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  }
                />
                <InfoRow
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={
                    lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  }
                />
                <InfoRow
                  icon={<Calendar size={14} />}
                  label="Created"
                  value={
                    lead.createdAt ? (
                      <span title={format(new Date(lead.createdAt), "PPpp")}>
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </span>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>
            </div>

            {/* Activity card */}

            <div className="rounded-xl border bg-card p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Activity
              </p>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-full bg-muted p-1.5">
                  <User size={12} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  Submitted by you
                  {lead.createdAt
                    ? ` on ${format(new Date(lead.createdAt), "MMMM d, yyyy")}`
                    : ""}
                  .
                </p>
              </div>
            </div>

            <div className="flex-1" />

            {/* Action Card */}

            <div className="flex gap-2 pb-2">
              <button
                onClick={handleUpdate}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Pencil size={14} /> Update
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-background px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (60%) ── */}
          {/* overflow-hidden on container + overflow-y-auto on body = scrollable content */}

          <div className="flex-1 flex flex-col min-h-0 rounded-xl border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b shrink-0">
              <p className="text-sm font-medium text-foreground">
                Conversation
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {lead.comments ? (
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {lead.comments}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No conversations recorded for this lead.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ── InfoRow helper ───────────────────────────────────────────────────────────
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2.5">
    <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
        {label}
      </span>
      <span className="text-sm text-foreground break-all">{value}</span>
    </div>
  </div>
);

export default LeadDetail;
