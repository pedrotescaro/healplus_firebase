import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

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
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
