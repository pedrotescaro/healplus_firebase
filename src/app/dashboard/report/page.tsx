import { ReportGenerator } from "@/components/dashboard/report-generator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Wound Report</h1>
        <p className="text-muted-foreground">Upload an image and provide anamnesis data for AI analysis.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
