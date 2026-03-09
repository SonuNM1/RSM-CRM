import DashboardLayout from "@/components/DashboardLayout";
import { LineChart } from "lucide-react";

const Analytics = () => {
  return (
    <DashboardLayout title="Analytics">
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <LineChart className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">This feature is under development — coming soon!</p>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;