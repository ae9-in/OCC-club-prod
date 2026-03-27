import dynamic from "next/dynamic";

const UserDashboard = dynamic(() => import("@/components/UserDashboard"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-brutal-gray">
      <div className="border-4 border-black bg-white p-8 font-black uppercase shadow-[8px_8px_0_0_#000]">
        Loading profile...
      </div>
    </div>
  ),
});

export default function ProfilePage() {
  return <UserDashboard />;
}
