"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DataCollection from "@/app/national-level/datacollection/page";
import DataOwnershipAndManagement from "@/app/national-level/dataownershipandmanagement/page";
import DataOpennessAndFlow from "@/app/national-level/dataopenessandflow/page";
import DataQuality from "@/app/national-level/dataquality/page";
import DataUse from "@/app/national-level/datause/page";

const sections = [
  { id: "datacollection", label: "Data Collection" },
  { id: "dataownershipandmanagement", label: "Data Ownership & Management" },
  { id: "dataopenessandflow", label: "Data Openness & Flow" },
  { id: "dataquality", label: "Data Quality" },
  { id: "datause", label: "Data Use" }
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(sections[0].id);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/getUser", {
          credentials: "include"
        });
        const data = await res.json();
        if (data.email) setUser({ email: data.email, name: data.name });
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    }
    fetchUser();
  }, []);

  const progress =
    (sections.findIndex(s => s.id === currentPage) + 1) / sections.length * 100;

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
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-cyan-800 to-blue-900 text-white p-6 flex flex-col justify-between shadow-2xl rounded-r-xl">
        <div>
          <h1 className="text-3xl font-semibold mb-8 text-center">Dashboard</h1>
          <nav className="space-y-4">
            {sections.map(section =>
              <button
                key={section.id}
                onClick={() => setCurrentPage(section.id)}
                className={`block w-full py-3 px-6 rounded-lg text-lg text-center transition ${currentPage ===
                section.id
                  ? "bg-white text-blue-900 font-semibold"
                  : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
              >
                {section.label}
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-between items-center bg-white shadow-md px-8 py-4 rounded-bl-xl">
          <span className="text-xl font-medium">
            Welcome, {user ? user.name : "Loading..."}
          </span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/settings")}
              className="text-gray-700 hover:text-gray-900 transition text-lg"
            >
              ⚙️
            </button>
            <button
              onClick={() => router.push("/national-level/login")}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-lg"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 mt-2">
          <motion.div
            className="h-2 bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content Section */}
        <main className="flex-1 p-6 overflow-hidden flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full overflow-auto p-4">
              {renderPage()}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
