"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import countries from "../../lib/countries"; // Import countries list

const esawasImages = [
  
  "/images/OP.png",
  "/images/clean-water.jpgq_-958x700.jpg",
  "/images/OG-image.jpg",
  "/images/LVWATSAN.jpg",
];

export default function AuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    country: "",
    organisation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % esawasImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (isSignUp) {
        alert("Account created! Logging you in...");
        setIsSignUp(false);
        await handleLoginAfterSignup();
      } else {
        router.push("/national-level/homepage");
      }
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAfterSignup = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/national-level/signup");
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try logging in manually.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image Slideshow */}
      <div
        className="w-2/3 flex flex-col justify-center items-center text-white p-10 transition-all duration-1000 bg-cover bg-center"
        style={{ backgroundImage: `url(${esawasImages[imageIndex]})` }}
      >
        <h1 className="text-4xl font-bold px-4 py-2 rounded-lg">
          Welcome to ESAWAS
        </h1>
        <p className="mt-4 text-lg text-center max-w-lg px-4 py-2 rounded-lg">
          Join our platform to assess and improve water and sanitation services.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          <div className="mb-4">
          <img src="/images/logo.svg" alt="ESAWAS" style={{width:"200px", marginLeft:"100px"}} />
          </div>
          <div className="flex justify-between mb-6">
            <button
              className={`text-lg font-semibold pb-2 w-1/2 border-b-2 ${
                !isSignUp ? "text-[#004F9F] border-[#004F9F]" : "text-gray-400 border-transparent"
              }`}
              onClick={() => setIsSignUp(false)}
            >
              Login
            </button>
            <button
              className={`text-lg font-semibold pb-2 w-1/2 border-b-2 ${
                isSignUp ? "text-[#004F9F] border-[#004F9F]" : "text-gray-400 border-transparent"
              }`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <>
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
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:border-[#004F9F] focus:ring-[#004F9F] focus:ring-1 outline-none"
                    required
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600">Organisation</label>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:border-[#004F9F] focus:ring-[#004F9F] focus:ring-1 outline-none"
                    placeholder="Your Organisation"
                    required
                  />
                </div>
              </>
            )}

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

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#004F9F] text-white py-3 rounded-lg hover:bg-[#003A70] transition"
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>
        </div>
        <footer className="absolute bottom-6 text-gray-600 text-sm">© 2025 ESAWAS. All rights reserved.</footer>
      </div>
    </div>
  );
}
