"use client";

import dynamic from "next/dynamic";
import UserDashboard from "@/components/UserDashboard";
import { useUser } from "@/context/UserContext";

const AdminPage = dynamic(() => import("@/app/occ-gate-842/page"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-brutal-gray">
      <div className="border-4 border-black bg-white p-8 font-black uppercase shadow-[8px_8px_0_0_#000]">
        Loading admin panel...
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const { user } = useUser();
  const hasAdminAccess = user?.role === "SUPER_ADMIN" || user?.role === "PLATFORM_ADMIN";

  if (hasAdminAccess) {
    return <AdminPage />;
  }

  return <UserDashboard />;
}
