import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyllabusOS — Personalized, Syllabus-Aware AI Learning Platform",
  description: "An evidence-driven, syllabus-aware curriculum knowledge graph and AI teacher for university engineering physics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f7f3ea] text-stone-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
