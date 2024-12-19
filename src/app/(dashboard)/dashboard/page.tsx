import { LayoutDashboard, Users, Activity, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 min-h-screen overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <LayoutDashboard className="text-blue-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Overview</h2>
            <p className="text-gray-500">Summary of your activities</p>
          </div>
        </div>
        <Link
          href={"/users"}
          className="bg-white p-6 rounded-lg shadow-lg flex items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
        >
          <Users className="text-green-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Users</h2>
            <p className="text-gray-500">Manage your users</p>
          </div>
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <Activity className="text-red-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Activity</h2>
            <p className="text-gray-500">Recent activities</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <Settings className="text-yellow-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Settings</h2>
            <p className="text-gray-500">Configure your preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
