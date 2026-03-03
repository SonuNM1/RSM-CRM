import { INFO_TOAST } from "@/constants/toast";
import { ConversationModalProps } from "@/types/lead";
import { Sparkles, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ConversationModal: React.FC<ConversationModalProps> = ({
  open,
  onClose,
  rowId,
  initialValue,
  onSave,
}) => {
  const [conversation, setConversation] = useState(initialValue);

  // sync textarea when modal opens

  useEffect(() => {
    if (open) setConversation(initialValue);
  }, [open, initialValue]);

  if (!open || rowId === null) return null;

  const handleEnhance = () => {
    toast.info("Feature under development, coming soon!", INFO_TOAST);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-background border border-border rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Client Conversation
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste the email thread with the client here
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              rows={14}
              placeholder="Paste the email conversation here..."
              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[200px]"
              autoFocus
            />
          </div>

          {/* AI Enhance */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleEnhance}
              disabled={!conversation.trim()}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[#37B3A6] text-white hover:bg-[#2e9e92] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              AI Enhance
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(rowId, conversation);
              onClose();
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;
