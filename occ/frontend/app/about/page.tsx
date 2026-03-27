import dynamic from "next/dynamic";

const AboutPageContent = dynamic(() => import("@/components/AboutPageContent"), {
  loading: () => <div className="min-h-screen animate-pulse bg-brutal-gray" />,
});

export default function AboutPage() {
  return <AboutPageContent />;
}
