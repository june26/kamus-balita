import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import { Toaster } from "sonner";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Kamus Upay",
  description:
    "Kamus Upay adalah aplikasi kamus sederhana untuk membantu orang tua dan pengasuh memahami bahasa bayi dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-sans`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
