"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
//--------------------------------
//--------------------------------
import DataCollection from "@/app/survey/dataCollection/question1a/question1aii/page";
import DataCollection1 from "@/app/survey/dataCollection/question1a/question1aiii/page";
import DataCollection2 from "@/app/survey/dataCollection/question1a/question1aiv/page";
import DataCollection3 from "@/app/survey/dataCollection/question1a/question1av/page";
import DataCollection4 from "@/app/survey/dataCollection/question1b/page";
import DataCollection5 from "@/app/survey/dataCollection/question1b/question1bi/page";
import DataCollection6 from "@/app/survey/dataCollection/question1b/question1bii/page";
import DataCollection7 from "@/app/survey/dataCollection/question1c/page";
import DataCollection8 from "@/app/survey/dataCollection/question1c/question1cii/page";
import DataCollection9 from "@/app/survey/dataCollection/question1c/question1ci/page";
import DataCollection10 from "@/app/survey/dataCollection/question1d/question1diii/page";
import DataCollection11 from "@/app/survey/dataCollection/question1d/question1dii/page";
import DataCollection12 from "@/app/survey/dataCollection/question1d/question1div/page";
import DataCollection13 from "@/app/survey/dataCollection/question1d/question1dv/page";
//-------------------------------
//-------------------------------
import DataOwnershipAndManagement from "@/app/survey/dataOwnershipAndManagement/question2a/page";
import DataOwnershipAndManagement1 from "@/app/survey/dataOwnershipAndManagement/question2a/question2ai/page";
import DataOwnershipAndManagement2 from "@/app/survey/dataOwnershipAndManagement/question2a/question2aii/page";
import DataOwnershipAndManagement3 from "@/app/survey/dataOwnershipAndManagement/question2a/question2aiii/page";
import DataOwnershipAndManagement4 from "@/app/survey/dataOwnershipAndManagement/question2b/page";
import DataOwnershipAndManagement5 from "@/app/survey/dataOwnershipAndManagement/question2b/question2bi/page";
import DataOwnershipAndManagement6 from "@/app/survey/dataOwnershipAndManagement/question2b/question2bii/page";
import DataOwnershipAndManagement7 from "@/app/survey/dataOwnershipAndManagement/question2c/question2cii/page";
import DataOwnershipAndManagement8 from "@/app/survey/dataOwnershipAndManagement/question2c/question2ciii/page";
import DataOwnershipAndManagement9 from "@/app/survey/dataOwnershipAndManagement/question2c/question2civ/page";
import DataOwnershipAndManagement10 from "@/app/survey/dataOwnershipAndManagement/question2c/question2cv/page";
import DataOwnershipAndManagement11 from "@/app/survey/dataOwnershipAndManagement/question2c/question2cvi/page";
import DataOwnershipAndManagement12 from "@/app/survey/dataOwnershipAndManagement/question2c/question2cvii/page";
import DataOwnershipAndManagement13 from "@/app/survey/dataOwnershipAndManagement/question2d/page";
import DataOwnershipAndManagement14 from "@/app/survey/dataOwnershipAndManagement/question2d/question2di/page";
import DataOwnershipAndManagement15 from "@/app/survey/dataOwnershipAndManagement/question2d/question2dii/page";
//-------------------------------
//-------------------------------
import DataOpennessAndFlow from "@/app/survey/dataOpenessAndFlow/question3a/question3aii/page";
import DataOpennessAndFlow1 from "@/app/survey/dataOpenessAndFlow/question3a/question3aiii/page";
import DataOpennessAndFlow2 from "@/app/survey/dataOpenessAndFlow/question3a/question3aiv/page";
import DataOpennessAndFlow3 from "@/app/survey/dataOpenessAndFlow/question3b/question3bii/page";
import DataOpennessAndFlow4 from "@/app/survey/dataOpenessAndFlow/question3b/question3biii/page";
import DataOpennessAndFlow5 from "@/app/survey/dataOpenessAndFlow/question3b/question3biv/page";
import DataOpennessAndFlow6 from "@/app/survey/dataOpenessAndFlow/question3b/question3bv/page";
import DataOpennessAndFlow7 from "@/app/survey/dataOpenessAndFlow/question3c/question3cii/page";
import DataOpennessAndFlow8 from "@/app/survey/dataOpenessAndFlow/question3c/question3ciii/page";
import DataOpennessAndFlow9 from "@/app/survey/dataOpenessAndFlow/question3c/question3civ/page";
import DataOpennessAndFlow10 from "@/app/survey/dataOpenessAndFlow/question3c/question3cv/page";
//--------------------------------------
//--------------------------------------
import DataQuality from "@/app/survey/dataQuality/question4a/page";
import DataQuality1 from "@/app/survey/dataQuality/question4a/question4ai/page";
import DataQuality2 from "@/app/survey/dataQuality/question4a/question4aii/page";
import DataQuality3 from "@/app/survey/dataQuality/question4b/question4bii/page";
//-------------------------------------------------------
//-------------------------------------------------------
import DataUse from "@/app/survey/dataUse/question5a/page";
import DataUse1 from "@/app/survey/dataUse/question5a/question5ai/page";
import DataUse2 from "@/app/survey/dataUse/question5b/page";
import DataUse3 from "@/app/survey/dataUse/question5b/question5bi/page";
import DataUse4 from "@/app/survey/dataUse/question5b/question5bii/page";
import DataUse5 from "@/app/survey/dataUse/question5c/question5cii/page";
import DataUse6 from "@/app/survey/dataUse/question5c/question5ciii/page";
import DataUse7 from "@/app/survey/dataUse/question5c/question5civ/page";
import DataUse8 from "@/app/survey/dataUse/question5d/question5dii/page";
import DataUse9 from "@/app/survey/dataUse/question5d/question5diii/page";
import DataUse10 from "@/app/survey/dataUse/question5d/question5div/page";
import DataUse11 from "@/app/survey/dataUse/question5d/question5dv/page";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState("datacollection");

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
            <button
              onClick={() => setCurrentPage("datacollection")}
              className={`block w-full py-3 px-6 rounded-lg text-lg text-center transition ${currentPage ===
              "datacollection"
                ? "bg-white text-blue-900 font-semibold"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
            >
              Data Collection
            </button>
            <button
              onClick={() => setCurrentPage("dataownershipandmanagement")}
              className={`block w-full py-3 px-6 rounded-lg text-lg text-center transition ${currentPage ===
              "dataownershipandmanagement"
                ? "bg-white text-blue-900 font-semibold"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
            >
              Data Ownership & Management
            </button>
            <button
              onClick={() => setCurrentPage("dataopenessandflow")}
              className={`block w-full py-3 px-6 rounded-lg text-lg text-center transition ${currentPage ===
              "dataopenessandflow"
                ? "bg-white text-blue-900 font-semibold"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
            >
              Data Openness & Flow
            </button>
            <button
              onClick={() => setCurrentPage("dataquality")}
              className={`block w-full py-3 px-6 rounded-lg text-lg text-center transition ${currentPage ===
              "dataquality"
                ? "bg-white text-blue-900 font-semibold"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
            >
              Data Quality
            </button>
            <button
              onClick={() => setCurrentPage("datause")}
              className={`block w-full py-3 px-6 rounded-lg text-lg text-center transition ${currentPage ===
              "datause"
                ? "bg-white text-blue-900 font-semibold"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
            >
              Data Use
            </button>
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
              onClick={() => router.push("/logout")}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-lg"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 p-6 overflow-hidden flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full overflow-auto p-4">
              {renderPage()} {/* Render the current page */}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
