
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";
import { ThemeProvider, useTheme } from "@/contexts/theme-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: "Heal+",
  description: "Cuidado aprimorado para feridas crônicas por telessaúde.",
};

// This Client Component reads the theme context and applies styles.
// It must be a separate component from RootLayout.
function AppBody({ children }: { children: React.ReactNode }) {
  "use client";
  const { fontSize } = useTheme();
  return (
    <html lang="en" suppressHydrationWarning style={{ '--font-scale': fontSize } as React.CSSProperties}>
      <body className={cn("font-body antialiased", inter.variable)}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

// This is the root Server Component.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppBody>{children}</AppBody>
    </ThemeProvider>
  );
}
