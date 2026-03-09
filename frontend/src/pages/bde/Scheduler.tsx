import DashboardLayout from "@/components/DashboardLayout";
import { Clock } from "lucide-react";

const Scheduler = () => {
  return (
    <DashboardLayout title="Scheduler">
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Clock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Scheduler</h2>
        <p className="text-sm text-muted-foreground">This page is under development — coming soon!</p>
      </div>
    </DashboardLayout>
  );
};

export default Scheduler;