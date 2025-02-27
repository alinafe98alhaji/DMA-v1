"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaTasks, FaCogs, FaBars } from "react-icons/fa";
import Image from "next/image";

const questionFlow = [
  { folder: "dataCollection", total: 5 },
  { folder: "dataOpenessAndFlow", total: 4 },
  { folder: "dataOwnershipAndManagement", total: 3 }
];

const DashboardLanding = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const navigateToFirstQuestion = () => {
    router.push(`/survey/${questionFlow[0].folder}/question1a/question1aii`);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-teal-500 via-teal-400 to-coral-400">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-teal-700 text-white shadow-xl transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen
          ? "w-64"
          : "w-16"}`}
      >
        <div className="p-4 flex justify-between items-center">
          {isSidebarOpen &&
            <Image
              src="/esawas-logo.png"
              alt="ESAWAS Logo"
              width={120}
              height={50}
            />}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>
        <nav className="mt-10 space-y-4">
          <div
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-coral-400"
            onClick={() => router.push("/dashboard")}
          >
            <FaHome className="text-xl mr-3" />
            {isSidebarOpen && <span>Dashboard</span>}
          </div>
          <div
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-coral-400"
            onClick={navigateToFirstQuestion}
          >
            <FaTasks className="text-xl mr-3" />
            {isSidebarOpen && <span>Start Assessment</span>}
          </div>
          <div
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-coral-400"
            onClick={() => router.push("/settings")}
          >
            <FaCogs className="text-xl mr-3" />
            {isSidebarOpen && <span>Settings</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col items-center justify-center text-white transition-all ${isSidebarOpen
          ? "ml-64"
          : "ml-16"}`}
      >
        <h1 className="text-5xl font-bold drop-shadow-lg">
          Welcome to Your Dashboard
        </h1>
        <p className="text-xl mt-4 max-w-xl text-center drop-shadow">
          Manage your assessments and explore insights with ease.
        </p>
        <div className="mt-8 flex space-x-4">
          <button
            onClick={navigateToFirstQuestion}
            className="px-8 py-4 bg-teal-700 text-white rounded-lg text-xl transition-transform hover:scale-105 hover:bg-teal-600 shadow-lg"
          >
            Start Assessment
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-coral-400 text-white rounded-lg text-xl transition-transform hover:scale-105 hover:bg-coral-500 shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
