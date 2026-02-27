import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientContextCardProps {
  comments?: string;
}

export const ClientContextCard = ({ comments }: ClientContextCardProps) => (
  <Card className="bg-muted/40">
    <CardHeader>
      <CardTitle className="text-lg">Client Communication Context</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="rounded-md border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        {
          comments || "No communication context available yet. Add notes about your interactions with this client."
        }
      </div>
    </CardContent>
  </Card>
);
