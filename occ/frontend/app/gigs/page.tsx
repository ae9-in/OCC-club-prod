import dynamic from "next/dynamic";

const GigsPageContent = dynamic(() => import("@/components/GigsPageContent"), {
  loading: () => <div className="min-h-screen animate-pulse bg-brutal-gray" />,
});

export default function GigsPage() {
  return <GigsPageContent />;
}
