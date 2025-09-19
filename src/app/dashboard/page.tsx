
"use client";

import { useAuth } from "@/hooks/use-auth";
import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";
import { PatientDashboard } from "@/components/dashboard/patient-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { FontScaleTest } from "@/components/dashboard/font-scale-test";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="space-y-6 page-responsive">
        <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
         <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (user.role === 'patient') {
    return (
      <div className="space-y-6 page-responsive">
        <FontScaleTest />
        <PatientDashboard />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 page-responsive">
      <FontScaleTest />
      <ProfessionalDashboard />
    </div>
  );
}
