"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DataCollection from "@/app/national-level/datacollection/page";
import DataOwnershipAndManagement from "@/app/national-level/dataownershipandmanagement/page";
import DataOpennessAndFlow from "@/app/national-level/dataopenessandflow/page";
import DataQuality from "@/app/national-level/dataquality/page";
import DataUse from "@/app/national-level/datause/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagnifyingGlassIcon, BellIcon, CogIcon, HomeIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const sections = [
  { id: "datacollection", label: "Data Collection", icon: "📊" },
  { id: "dataownershipandmanagement", label: "Data Ownership & Management", icon: "🔐" },
  { id: "dataopenessandflow", label: "Data Openness & Flow", icon: "🌐" },
  { id: "dataquality", label: "Data Quality", icon: "✅" },
  { id: "datause", label: "Data Use", icon: "📈" }
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string; avatar: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(sections[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility on mobile

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/getUser", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.email) {
          setUser({
            email: data.email,
            name: data.name,
            avatar: data.avatar || "/images/afriq.png",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    }
    fetchUser();
  }, []);

  const progress =
    ((sections.findIndex(s => s.id === currentPage) + 1) / sections.length) * 100;

  const renderPage = () => {
    switch (currentPage) {
      case "datacollection":
        return <DataCollection />;
      case "dataownershipandmanagement":
        return <DataOwnershipAndManagement />;
      case "dataopenessandflow":
        return <DataOpennessAndFlow />;
      case "dataquality":
        return <DataQuality />;
      case "datause":
        return <DataUse />;
      default:
        return <p>Page not found</p>;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-blue-600 to-teal-600 text-white p-6 flex flex-col justify-between shadow-2xl rounded-r-xl transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative`}
      >
        <div>
          <div className="mb-8 flex justify-between items-center">
            <img
              src="/images/logo.svg"
              alt="ESAWAS"
              style={{ width: "200px" }}
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-blue-200 lg:hidden"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-2">
            {sections.map(section =>
              <button
                key={section.id}
                onClick={() => {
                  setCurrentPage(section.id);
                  setSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`flex items-center w-full py-3 px-6 rounded-lg text-lg text-left transition-all duration-300 ${currentPage ===
                section.id
                  ? "bg-white text-blue-900 font-semibold shadow-md"
                  : "bg-white bg-opacity-0 hover:bg-opacity-10 text-white"}`}
              >
                <span className="mr-4 text-xl">{section.icon}</span>
                {section.label}
              </button>
            )}
          </nav>
        </div>
        <div className="mt-8">
          <p className="text-sm text-white opacity-75">
            © 2025 ESAWAS. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex justify-between items-center bg-white shadow-md px-4 lg:px-8 py-4 rounded-bl-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 hover:text-gray-900 lg:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="text-xl font-medium">
              Welcome, {user ? user.name : "Loading..."}
            </span>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden lg:block">
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="text-gray-700 hover:text-gray-900 transition">
              <BellIcon className="w-6 h-6" />
            </button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => router.push("/settings")}
              className="text-gray-700 hover:text-gray-900 transition"
            >
              <CogIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => router.push("/national-level/signup")}
              className="bg-red-500 text-white px-4 lg:px-5 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden lg:inline">Home</span>
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content Section */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-white shadow-xl rounded-xl p-4 lg:p-6"
          >
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}