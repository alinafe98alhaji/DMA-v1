"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const UserLandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );

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

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Overlay for sidebar */}
      {sidebarOpen &&
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-esa-darkblue text-white transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white">
          <Image
            src="/images/logo.svg"
            alt="ESAWAS Logo"
            width={150}
            height={150}
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-esa-lightblue"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-4 mt-8">
          <a
            href="#"
            className="block px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            Dashboard
          </a>
          <a
            href="/national-level/homepage"
            className="block px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            Start Assessment
          </a>
          <a
            href="#"
            className="block px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            View Results
          </a>
          <a
            href="#"
            className="block px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            Settings
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-esa-darkblue hover:text-esa-blue"
          >
            <Bars3Icon className="w-8 h-8" />
          </button>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {user ? user.name.slice(0, 2).toUpperCase() : "JD"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-esa-darkblue">
                Welcome, {user ? user.name : "Loading..."}!
              </h1>
              <p className="text-sm text-esa-darkblue">
                Here's your dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold text-esa-darkblue">
                Start Assessment
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Take your assessment now!
              </p>
              <Button className="bg-esa-blue hover:bg-esa-lightblue mt-4">
                Start Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold text-esa-darkblue">
                View Results
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Review your past results.
              </p>
              <Button
                variant="outline"
                className="text-esa-blue hover:bg-esa-lightblue mt-4"
              >
                View Results
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold text-esa-darkblue">
                Settings
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Update your preferences.
              </p>
              <Button
                variant="outline"
                className="text-esa-blue hover:bg-esa-lightblue mt-4"
              >
                Edit Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserLandingPage;
