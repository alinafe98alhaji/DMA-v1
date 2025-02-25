"use client"; // Enables client-side interactivity in Next.js

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Home() {
  const router = useRouter(); // Initialize router
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // Store token and redirect on successful login
      if (!isSignUp) {
        document.cookie = `token=${data.token}; path=/; Secure`;
        router.push("/survey/userDash"); // Redirect after successful login
      } else {
        alert("Account created! You can now log in.");
        setIsSignUp(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-[#004F9F] to-[#00AEEF] text-white p-10">
        <h1 className="text-4xl font-bold">Welcome to eSAWAS</h1>
        <p className="mt-4 text-lg text-center max-w-lg">
          Join our platform to assess and improve water and sanitation services.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          {/* Toggle between Login and Sign Up */}
          <div className="flex justify-between mb-6">
            <button
              className={`text-lg font-semibold pb-2 w-1/2 border-b-2 ${!isSignUp
                ? "text-[#004F9F] border-[#004F9F]"
                : "text-gray-400 border-transparent"}`}
              onClick={() => setIsSignUp(false)}
            >
              Login
            </button>
            <button
              className={`text-lg font-semibold pb-2 w-1/2 border-b-2 ${isSignUp
                ? "text-[#004F9F] border-[#004F9F]"
                : "text-gray-400 border-transparent"}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {isSignUp &&
              <div className="mb-4">
                <label className="block text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:border-[#004F9F] focus:ring-[#004F9F] focus:ring-1 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>}

            <div className="mb-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:border-[#004F9F] focus:ring-[#004F9F] focus:ring-1 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:border-[#004F9F] focus:ring-[#004F9F] focus:ring-1 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {error &&
              <p className="text-red-500 text-sm mb-2">
                {error}
              </p>}

            <button
              type="submit"
              className="w-full bg-[#004F9F] text-white py-3 rounded-lg hover:bg-[#003A70] transition"
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              className="text-[#004F9F] font-semibold"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
