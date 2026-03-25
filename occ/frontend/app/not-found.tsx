import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brutal-gray flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0_0_#000] max-w-2xl">
          <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter text-black mb-8">
            404
          </h1>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-6 border-b-4 border-black pb-4">
            Page Not Found
          </h2>
          <p className="text-xl font-bold text-gray-700 mb-12">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link 
            href="/"
            className="bg-black text-white px-12 py-6 font-black uppercase text-2xl border-4 border-black shadow-[10px_10px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4 justify-center"
          >
            <Home className="w-8 h-8" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
