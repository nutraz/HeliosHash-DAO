import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HeliosHash DAO - Solar Energy Decentralized Autonomous Organization",
  description: "Empowering India's Solar Future through Decentralized Autonomous Organization powered by Internet Computer",
  keywords: ["HeliosHash", "DAO", "Solar Energy", "Internet Computer", "Blockchain", "India", "Renewable Energy"],
  authors: [{ name: "HeliosHash Team" }],
  openGraph: {
    title: "HeliosHash DAO",
    description: "Empowering India's Solar Future through Decentralized Autonomous Organization",
    url: "https://helioshash.org",
    siteName: "HeliosHash DAO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeliosHash DAO",
    description: "Empowering India's Solar Future through Decentralized Autonomous Organization",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
