import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ToggleDarkMode from "@/components/toggle-darkmode";

export const metadata: Metadata = {
  title: "TodoApp Nícolas",
  description: "TodoApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gray-100 dark:bg-gray-900" >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ToggleDarkMode/>
        </ThemeProvider>
      </body>
    </html>
  );
}
