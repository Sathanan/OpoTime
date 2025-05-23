import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/clientLayout";
import RequireAuth from "./components/requireAuth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Opo Time",
  description: "Manage your Time for Oponion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RequireAuth>
          <ClientLayout>{children}</ClientLayout>
        </RequireAuth>
      </body>
    </html>
  );
}
