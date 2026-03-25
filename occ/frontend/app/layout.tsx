import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { TransitionProvider } from "@/context/TransitionContext";
import BackgroundGrid from "@/components/BackgroundGrid";
import TransitionOverlay from "@/components/TransitionOverlay";
import EntryOverlay from "@/components/EntryOverlay";
import SiteFooter from "@/components/SiteFooter";

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
            <div className="relative z-10">
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <SiteFooter />
            </div>
            <TransitionOverlay />
            <EntryOverlay />
          </TransitionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
