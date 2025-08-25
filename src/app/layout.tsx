
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";
import { AppProvider } from "@/contexts/app-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

// This is the root Server Component.
// It is responsible for the <html> and <body> tags.
// It should not be a client component.
export const metadata: Metadata = {
  title: "Heal+",
  description: "Cuidado aprimorado para feridas crônicas por telessaúde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", inter.variable)}>
        <AppProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
