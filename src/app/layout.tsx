import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobPortal",
  description: "Professional Recruitment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
