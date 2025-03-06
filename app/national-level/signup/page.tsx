"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRightIcon, MinusIcon } from "@heroicons/react/20/solid"; // Example icons
import Image from "next/image"; // For logo

const UserLandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = "John Doe"; // Replace with dynamic user data

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"} fixed z-10 inset-0 bg-esa-darkblue text-white transform transition-transform duration-300 md:translate-x-0 md:relative md:w-64`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white">
          <Image
            src="/images/logo.svg"
            alt="ESAWAS Logo"
            width={400}
            height={400}
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-esa-lightblue"
          >
            <MinusIcon className="w-6 h-6" />
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
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-esa-darkblue hover:text-esa-blue"
          >
            <MinusIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-esa-darkblue">
                Welcome, {userName}!
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
