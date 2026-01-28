import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ReduxProvider from "@/components/auth/ReduxProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

// ISR: Default 3-second revalidation applied via Services/api.ts

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Medical App",
    template: "%s | Medical App",
  },
  description: "Healthcare application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}>

        <ReduxProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ReduxProvider>

      </body>
    </html>
  );
}
