"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GitCompareArrows, User } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Here&apos;s a quick overview of what you can do.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generate Wound Report
            </CardTitle>
            <CardDescription>
              Upload a wound image and input anamnesis data to generate a comprehensive AI-powered report.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/report" passHref>
              <Button className="w-full">Create Report</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5 text-primary" />
              Compare Wound Images
            </CardTitle>
            <CardDescription>
              Analyze healing progress by comparing two wound images side-by-side with AI-driven insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/compare" passHref>
              <Button className="w-full">Compare Images</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Manage Your Profile
            </CardTitle>
            <CardDescription>
              Keep your professional information and credentials up to date for secure and personalized access.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/profile" passHref>
              <Button className="w-full">View Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
