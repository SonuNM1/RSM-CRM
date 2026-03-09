import { Input } from "@/components/ui/input";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];
const AMPM = ["AM", "PM"];

const getHour12 = (dateStr: string) => {
  const h = parseInt(dateStr.split("T")[1]?.split(":")[0] || "0");
  return h === 0 ? "12" : h > 12 ? String(h - 12).padStart(2, "0") : String(h).padStart(2, "0");
};
const getMinute = (dateStr: string) => dateStr.split("T")[1]?.split(":")[1] || "00";
const getAmPm = (dateStr: string) =>
  parseInt(dateStr.split("T")[1]?.split(":")[0] || "0") >= 12 ? "PM" : "AM";
const buildDateStr = (dateStr: string, hour12: string, minute: string, ampm: string) => {
  const date = dateStr.split("T")[0] || "";
  let h = parseInt(hour12);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${date}T${String(h).padStart(2, "0")}:${minute}`;
};

interface TimeSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const TimeSelector = ({ label, value, onChange }: TimeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Input
        type="date"
        value={value.split("T")[0]}
        onChange={(e) => {
          const time = value.split("T")[1] || "00:00";
          onChange(`${e.target.value}T${time}`);
        }}
      />
      <div className="flex gap-2">
        <select
          className="flex-1 border border-input rounded-md px-3 py-2 text-sm bg-background"
          value={getHour12(value)}
          onChange={(e) => onChange(buildDateStr(value, e.target.value, getMinute(value), getAmPm(value)))}
        >
          {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
        <select
          className="flex-1 border border-input rounded-md px-3 py-2 text-sm bg-background"
          value={getMinute(value)}
          onChange={(e) => onChange(buildDateStr(value, getHour12(value), e.target.value, getAmPm(value)))}
        >
          {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          className="flex-1 border border-input rounded-md px-3 py-2 text-sm bg-background"
          value={getAmPm(value)}
          onChange={(e) => onChange(buildDateStr(value, getHour12(value), getMinute(value), e.target.value))}
        >
          {AMPM.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      {value && value.includes("T") && value.split("T")[0] && (
        <p className="text-xs text-muted-foreground">
          {new Date(value).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "numeric", month: "short", year: "numeric",
            hour: "numeric", minute: "2-digit", hour12: true,
          })}
        </p>
      )}
    </div>
  );
};