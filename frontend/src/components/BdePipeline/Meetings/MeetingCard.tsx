import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Meeting } from "@/types/lead";
import { AlertCircle, CalendarDays, CheckCircle2, User } from "lucide-react";
import { useState } from "react";
import { updateMeetingOutcomeAPI } from "@/api/dashboard.api";
import { toast } from "sonner";
import { SUCCESS_TOAST, ERROR_TOAST } from "@/constants/toast";

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
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
export const formatMeetingDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const statusColors: Record<string, string> = {
  "Meeting Scheduled": "bg-violet-100 text-violet-700",
  Converted: "bg-green-200 text-green-800",
  Lost: "bg-red-100 text-red-700",
  "Follow Up": "bg-orange-100 text-orange-700",
  "Not Interested": "bg-red-100 text-red-600",
  Trash: "bg-slate-100 text-slate-500",
};

// --- reusable avatar block ---
const LeadAvatar = ({ name, website }: { name: string; website: string }) => (
  <div className="flex items-center gap-3">
    <div
      className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(name)}`}
    >
      {getInitials(name)}
    </div>
    <div>
      <p className="font-semibold text-foreground text-sm">{name}</p>
      <p className="text-xs text-muted-foreground">{website}</p>
    </div>
  </div>
);

// --- update outcome modal ---
export const UpdateOutcomeModal = ({
  meeting,
  open,
  onClose,
  onSuccess,
}: {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [step, setStep] = useState<"select" | "outcome">("select");
  const [happened, setHappened] = useState<boolean | null>(null);
  const [outcomeStatus, setOutcomeStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const happenedStatuses = [
    "Converted",
    "Follow Up",
    "Not Interested",
    "Lost",
    "Trash",
  ];
  const didntHappenStatuses = ["Follow Up", "Lost", "Trash"];

  const handleClose = () => {
    setStep("select");
    setHappened(null);
    setOutcomeStatus("");
    setNote("");
    onClose();
  };

  const handleSave = async () => {
    if (!meeting || !outcomeStatus) return;
    try {
      setLoading(true);
      const res = await updateMeetingOutcomeAPI(meeting._id, {
        happened: happened!,
        status: outcomeStatus,
        note: note.trim() || undefined,
      });
      if (res.data.success) {
        toast.success("Meeting outcome updated", SUCCESS_TOAST);
        handleClose();
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to update outcome", ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Meeting Outcome</DialogTitle>
          {meeting && (
            <p className="text-sm text-muted-foreground pt-1">
              {meeting.name} — {formatMeetingDate(meeting.meetingDate)}
            </p>
          )}
        </DialogHeader>

        {step === "select" && (
          <div className="grid grid-cols-2 gap-3 py-4">
            <button
              onClick={() => {
                setHappened(true);
                setStep("outcome");
              }}
              className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-border hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium text-foreground">
                Meeting Happened
              </span>
            </button>
            <button
              onClick={() => {
                setHappened(false);
                setStep("outcome");
              }}
              className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-border hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <span className="text-sm font-medium text-foreground">
                Didn't Happen
              </span>
            </button>
          </div>
        )}

        {step === "outcome" && (
          <div className="space-y-4 py-4">
            <button
              onClick={() => {
                setStep("select");
                setOutcomeStatus("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Select value={outcomeStatus} onValueChange={setOutcomeStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  {(happened ? happenedStatuses : didntHappenStatuses).map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Note <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                placeholder="Add a note about the meeting..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {step === "outcome" && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={!outcomeStatus || loading} onClick={handleSave}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

// --- upcoming card ---
export const UpcomingCard = ({
  meeting,
  isAdmin,
  onViewLead,
}: {
  meeting: Meeting;
  isAdmin: boolean;
  onViewLead: (id: string) => void;
}) => (
  <Card className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-violet-500 space-y-4">
    <LeadAvatar name={meeting.name} website={meeting.website} />
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CalendarDays className="h-4 w-4 shrink-0" />
      <span>{formatMeetingDate(meeting.meetingDate)}</span>
    </div>
    {isAdmin && meeting.assignedTo && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4 shrink-0" />
        <span className="text-muted-foreground">Assigned BDE:</span>
        <span className="text-foreground font-medium">
          {meeting.assignedTo.name}
        </span>
      </div>
    )}
    <div className="flex items-center justify-between pt-1">
      <Badge
        className={`${statusColors["Meeting Scheduled"]} pointer-events-none`}
      >
        Meeting Scheduled
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewLead(meeting._id)}
      >
        View Lead
      </Button>
    </div>
  </Card>
);

// --- past card ---
export const PastCard = ({
  meeting,
  isAdmin,
  onViewLead,
  onUpdateOutcome,
}: {
  meeting: Meeting;
  isAdmin: boolean;
  onViewLead: (id: string) => void;
  onUpdateOutcome?: (meeting: Meeting) => void;
}) => (
  <Card className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-gray-300 space-y-4">
    <LeadAvatar name={meeting.name} website={meeting.website} />
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CalendarDays className="h-4 w-4 shrink-0" />
      <span>{formatMeetingDate(meeting.meetingDate)}</span>
    </div>
    {isAdmin && meeting.assignedTo && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4 shrink-0" />
        <span className="text-muted-foreground">Assigned BDE:</span>
        <span className="text-foreground font-medium">
          {meeting.assignedTo.name}
        </span>
      </div>
    )}
    {meeting.hadMeeting ? (
      <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Meeting Happened
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium">
        <AlertCircle className="h-3.5 w-3.5" />
        Awaiting Outcome
      </div>
    )}
    <div className="flex items-center justify-between pt-1">
      {meeting.hadMeeting && meeting.outcomeStatus ? (
        <Badge
          className={
            statusColors[meeting.outcomeStatus] || "bg-gray-100 text-gray-600"
          }
        >
          {meeting.outcomeStatus}
        </Badge>
      ) : (
        <Badge
          className={`${statusColors["Meeting Scheduled"]} pointer-events-none`}
        >
          Meeting Scheduled
        </Badge>
      )}
      <div className="flex gap-2">
        {!meeting.hadMeeting && isAdmin && onUpdateOutcome && (
          <Button size="sm" onClick={() => onUpdateOutcome(meeting)}>
            Update Outcome
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewLead(meeting._id)}
        >
          View Lead
        </Button>
      </div>
    </div>
  </Card>
);
