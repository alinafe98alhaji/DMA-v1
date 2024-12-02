"use client"; // Ensure the component is only rendered client-side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use this import for the App Router

const countries = ["Zambia", "Kenya", "Uganda", "Rwanda", "Malawi"];

export default function BasicDetails() {
  const [formData, setFormData] = useState({
    name: "",
    organisation: "",
    country: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    organisation: "",
    country: ""
  });

  const [isClient, setIsClient] = useState(false);

  // Initialize router normally, use it later after confirming client-side rendering
  const router = useRouter(); // Initialize the router here, directly in the component body

  // Set to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() === "" && name !== "country") {
      setErrors({ ...errors, [name]: `${name} is required` });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: formData.name.trim() === "" ? "Name is required" : "",
      organisation:
        formData.organisation.trim() === "" ? "Organisation is required" : "",
      country: formData.country.trim() === "" ? "Country is required" : ""
    };
    setErrors(newErrors);

    // Check if there are no errors before proceeding
    if (!Object.values(newErrors).some(error => error)) {
      console.log("Submitted data:", formData);

      // Save data to session storage
      sessionStorage.setItem("basicDetails", JSON.stringify(formData));

      // Save data to the database
      try {
        const response = await fetch("/api/basicDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error("Failed to save data to the database");
        }

        const data = await response.json();
        console.log("Basic details saved successfully");

        // Save the user_id to session storage for later use
        if (data.userId) {
          sessionStorage.setItem("user_id", data.userId);
        }

        // Ensure client-side rendering before attempting navigation
        if (isClient) {
          router.push("/survey/dataCollection/question1a"); // Navigate to the next page
        }
      } catch (error) {
        console.error("Error saving basic details:", error);
      }
    }
  };

  if (!isClient) return null; // Render nothing while waiting for client-side setup

  return (
    <div className="h-screen bg-gradient-to-b from-teal-200 via-blue-400 to-blue-800 text-teal-900 flex flex-col items-center justify-center font-sans overflow-hidden">
      <main className="flex flex-col gap-6 items-center text-center bg-blue-200 bg-opacity-85 p-8 rounded-2xl shadow-2xl max-w-2xl w-full transform hover:scale-[1.01] duration-300">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-[Inter] font-bold tracking-tight text-blue-700 drop-shadow-md leading-tight mb-4">
          Enter Your Details
        </h1>

        {/* Form */}
        <form
          className="flex flex-col gap-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name &&
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>}
          </div>

          {/* Organisation Field */}
          <div>
            <input
              type="text"
              name="organisation"
              placeholder="Organisation"
              value={formData.organisation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.organisation &&
              <p className="text-red-500 text-sm mt-1">
                {errors.organisation}
              </p>}
          </div>

          {/* Country Field (Dropdown) */}
          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                Select your country
              </option>
              {countries.map(country =>
                <option key={country} value={country}>
                  {country}
                </option>
              )}
            </select>
            {errors.country &&
              <p className="text-red-500 text-sm mt-1">
                {errors.country}
              </p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full py-2 px-6 font-[Inter] font-semibold text-lg transition-transform transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
