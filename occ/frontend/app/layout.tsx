import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { TransitionProvider } from "@/context/TransitionContext";
import BackgroundGrid from "@/components/BackgroundGrid";
import TransitionOverlay from "@/components/TransitionOverlay";
import EntryOverlay from "@/components/EntryOverlay";

export const metadata: Metadata = {
  title: "OCC - Off Campus Clubs",
  description: "Just another way to have a good life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <TransitionProvider>
            <BackgroundGrid />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <TransitionOverlay />
            <EntryOverlay />
          </TransitionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
