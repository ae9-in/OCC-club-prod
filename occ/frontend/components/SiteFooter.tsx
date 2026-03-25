import Link from "next/link";
import SiteContainer from "@/components/SiteContainer";

export default function SiteFooter() {
  return (
    <footer className="w-full border-t-8 border-black bg-black py-12 text-white">
      <SiteContainer className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-2xl font-black uppercase tracking-tight">OCC.</p>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/60">Work. Build. Play.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-[0.18em] text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/feeds" className="hover:text-white">Feeds</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/clubs" className="hover:text-white">Clubs</Link>
          <Link href="/gigs" className="hover:text-white">Gigs</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
        </div>
      </SiteContainer>
    </footer>
  );
}
