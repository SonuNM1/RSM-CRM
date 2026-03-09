import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";
import { ADMIN_ONLY_STATUSES, BDE_STATUSES } from "@/constants/leadStatus";
import { updateLeadActivityAPI } from "@/api/lead.api";
import { UpdateLeadCardProps } from "@/types/lead";
import { TimeSelector } from "../TimeSelector";

export const UpdateLeadCard = ({
  leadId,
  currentStatus,
  onUpdate,
}: UpdateLeadCardProps) => {
  const { user } = useAuth();

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  const HOURS = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const MINUTES = ["00", "15", "30", "45"];
  const AMPM = ["AM", "PM"];

  const handleSave = async () => {
    if (!status) {
      toast.error("Please select a status", ERROR_TOAST);
      return;
    }
    if (status === currentStatus) {
      toast.error("Status is already set to " + currentStatus, ERROR_TOAST);
      return;
    }

    if (status === "Follow Up" && !followUpDate) {
      toast.error("Please select a follow-up date", ERROR_TOAST);
      return;
    }

    if (status === "Meeting Scheduled" && !meetingDate) {
      toast.error("Please select a meeting date", ERROR_TOAST);
      return;
    }

    try {
      setLoading(true);

      const res = await updateLeadActivityAPI(leadId, {
        status: status && status !== currentStatus ? status : undefined,
        note: note.trim() || undefined,
        meetingDate: status === "Meeting Scheduled" ? meetingDate : undefined,
        followUpDate: status === "Follow Up" ? followUpDate : undefined,
      });

      if (res.data.success) {
        toast.success("Lead updated successfully", SUCCESS_TOAST);
        setNote("");
        setStatus("");
        setMeetingDate("");
        setFollowUpDate("");
        onUpdate();
      }
    } catch (error) {
      console.error("Update lead card error: ", error);
      toast.error(
        error?.response?.data?.message || "Failed to update lead",
        ERROR_TOAST,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (status === "Meeting Scheduled") {
      if (!meetingDate) {
        toast.error("Please select a meeting date first", ERROR_TOAST);
        return;
      }
      setShowConfirm(true);
    } else {
      handleSave();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Lead</CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4 ${loading ? "pointer-events-none opacity-60" : ""}`}>
          {/* Status */}

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {BDE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
                {ADMIN_ONLY_STATUSES.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    disabled={user?.role === "BDE_Executive"}
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meeting date - only shown when Meeting scheduled is selected */}

          {status === "Meeting Scheduled" && (
            <div className="space-y-2">
              <Label>Meeting Date & Time</Label>
              <TimeSelector
                value={meetingDate}
                onChange={setMeetingDate}
                label="Meeting Date & Time"
              />
            </div>
          )}

          {status === "Follow Up" && (
            <div className="space-y-2">
              <Label>Follow Up Date & Time</Label>
              <TimeSelector
                value={followUpDate}
                onChange={setFollowUpDate}
                label="Follow Up Date & Time"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea
              placeholder="Add a note about this interaction..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60"
            onClick={handleSaveClick}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              "Save Update"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Cofirmation dialog for Meeting Scheduled */}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Meeting</AlertDialogTitle>
            <AlertDialogDescription>
              Has the client confirmed the meeting? This lead will appear in the
              Meetings section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirm(false);
                handleSave();
              }}
            >
              Yes, Schedule Meeting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
