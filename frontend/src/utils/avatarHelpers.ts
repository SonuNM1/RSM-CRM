export const AVATAR_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-violet-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500",
];

export const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();