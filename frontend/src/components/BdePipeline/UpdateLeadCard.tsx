import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ERROR_TOAST, SUCCESS_TOAST } from "@/constants/toast";
import { ADMIN_ONLY_STATUSES, BDE_STATUSES } from "@/constants/leadStatus";
import { updateLeadActivityAPI } from "@/api/lead.api";

interface UpdateLeadCardProps {
  leadId: string;
  currentStatus: string;
  onUpdate: () => void; // callback to refresh data after update
}

export const UpdateLeadCard = ({
  leadId,
  currentStatus,
  onUpdate,
}: UpdateLeadCardProps) => {

  const { user } = useAuth();

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!note.trim() && status === currentStatus) {
      toast.error("Please add a note or change the status", ERROR_TOAST);
      return;
    }

    try {
      setLoading(true);

      const res = await updateLeadActivityAPI(leadId, {
        status: status !== currentStatus ? status : undefined,
        note: note.trim() || undefined,
      });

      if(res.data.success){
        toast.success("Lead updated successfully", SUCCESS_TOAST); 
        setNote("") ; 
        onUpdate() ; 
      }

    } catch (error: any) {
      console.error("Update lead card error: ", error);
      toast.error(error?.response?.data?.message || "Failed to update lead", ERROR_TOAST);
    } finally {
      setLoading(false) ; 
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Update Lead</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Update"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Saving will add an entry to the activity timeline. Status update is
          optional.
        </p>
      </CardContent>
    </Card>
  );
};
