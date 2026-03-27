import dynamic from "next/dynamic";

const ClubsDirectoryPage = dynamic(() => import("@/components/ClubsDirectoryPage"), {
  loading: () => <div className="min-h-screen animate-pulse bg-brutal-gray" />,
});

export default function ClubsPage() {
  return <ClubsDirectoryPage />;
}
