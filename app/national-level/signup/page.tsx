"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bars3Icon, XMarkIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

const UserLandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState(true);

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
            avatar: data.avatar || "/images/default-avatar.png",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-esa-darkblue text-white transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative`}
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
            className="text-white hover:text-esa-lightblue lg:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        {/* User Info Section */}
        <div className="p-6 border-b border-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{user?.name || "Loading..."}</h2>
              <p className="text-sm text-gray-300 break-words truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
        {/* Sidebar Navigation */}
        <nav className="space-y-2 mt-4">
          <Link
            href="/national-level/homepage"
            className="flex items-center px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            <span>📝</span>
            <span className="ml-3">Start Assessment</span>
          </Link>
          <Link
            href="/national-level/responses"
            className="flex items-center px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            <span>📊</span>
            <span className="ml-3">View Results</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-6 py-3 text-lg font-medium hover:bg-esa-lightblue transition duration-300"
          >
            <span>⚙️</span>
            <span className="ml-3">Settings</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-esa-darkblue hover:text-esa-blue lg:hidden"
          >
            <Bars3Icon className="w-8 h-8" />
          </button>
          <div className="flex items-center gap-6">
            <div className="relative">
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-esa-blue"
              />
            </div>
            <button className="text-esa-darkblue hover:text-esa-blue">
              <BellIcon className="w-6 h-6" />
            </button>
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold text-esa-darkblue">
                Water Access Projects
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Track progress on water access initiatives.
              </p>
              <a href="https://www.esawas.org" target="_blank" rel="noopener noreferrer">
                <Button className="bg-esa-blue hover:bg-esa-lightblue mt-4">
                  View Projects
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold text-esa-darkblue">
                Sanitation Programs
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Monitor sanitation improvement programs.
              </p>
              <a href="https://www.esawas.org" target="_blank" rel="noopener noreferrer">
                <Button className="bg-esa-blue hover:bg-esa-lightblue mt-4">
                  View Programs
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent className="text-center">
              <h2 className="text-lg font-semibold text-esa-darkblue">
                Community Reports
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Access reports from local communities.
              </p>
              <a href="https://www.esawas.org" target="_blank" rel="noopener noreferrer">
                <Button className="bg-esa-blue hover:bg-esa-lightblue mt-4">
                  View Reports
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* ESAWAS Mission Section */}
        <div className="mt-8">
          <Card className="bg-white shadow-lg rounded-2xl p-6">
            <CardContent>
              <h2 className="text-lg font-semibold text-esa-darkblue mb-4">
                About ESAWAS
              </h2>
              <p className="text-sm text-gray-600">
                The Eastern and Southern Africa Water and Sanitation (ESAWAS) Regulators Association is a regional body dedicated to improving water and sanitation services across Eastern and Southern Africa. Our mission is to promote effective regulation, capacity building, and knowledge sharing among water and sanitation regulators in the region.
              </p>
              <div className="mt-4">
                <a href="https://www.esawas.org" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-esa-blue hover:bg-esa-lightblue">
                    Learn More
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserLandingPage;