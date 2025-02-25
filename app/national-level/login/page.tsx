"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Login successful
        router.push("/national-level/homepage"); // Redirect to /homepage
      } else {
        // Display error message
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 bg-cover flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl text-gray-900 font-semibold text-center text-teal-800 mb-6">
          Log In
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error &&
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>}

          <button
            type="submit"
            className="w-full bg-teal-500 text-white p-3 rounded-md font-medium hover:bg-teal-600 transition duration-200"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
