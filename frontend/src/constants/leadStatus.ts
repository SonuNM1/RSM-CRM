export const LEAD_STATUS_COLORS: Record<string, string> = {
  "New":             "bg-blue-100 text-blue-700",
  "Assigned":        "bg-indigo-100 text-indigo-700",
  "RNR":             "bg-yellow-100 text-yellow-700",
  "Answered":        "bg-green-100 text-green-700",
  "Number NA":       "bg-gray-100 text-gray-600",
  "Out of Service":  "bg-gray-100 text-gray-600",
  "Can't Connect":   "bg-gray-100 text-gray-600",
  "DNS":             "bg-purple-100 text-purple-700",
  "Follow Up":       "bg-orange-100 text-orange-700",
  "Interested":      "bg-emerald-100 text-emerald-700",
  "Not Interested":  "bg-red-100 text-red-600",
  "Qualified":       "bg-teal-100 text-teal-700",
  "Converted":       "bg-green-200 text-green-800",
  "Lost":            "bg-red-100 text-red-700",
  "Trash":           "bg-slate-100 text-slate-500",
};

// BDE cannot set these — only Admin/Super_Admin
export const ADMIN_ONLY_STATUSES = ["Qualified", "Converted", "Lost", "Trash"];

// All statuses BDE can set
export const BDE_STATUSES = [
  "RNR", "Answered", "Number NA", "Out of Service",
  "Can't Connect", "DNS", "Follow Up", "Interested", "Not Interested"
];

export const ALL_STATUSES = Object.keys(LEAD_STATUS_COLORS);