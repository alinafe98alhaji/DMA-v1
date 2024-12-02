"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Responses {
  [key: string]: string;
}

const Question1a: React.FC = () => {
  const router = useRouter();

  // Define the seven areas of interest
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  const [responses, setResponses] = useState<Responses>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
    setErrors(prev => ({
      ...prev,
      [area]: false // Clear error for this area
    }));
  };

  const handleSubmit = async () => {
    // Validate that all areas have responses
    const newErrors: Record<string, boolean> = {};
    let hasErrors = false;

    areas.forEach(area => {
      if (!responses[area]) {
        newErrors[area] = true;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      alert("Please ensure all areas have a selection before proceeding.");
      return;
    }

    const userId = sessionStorage.getItem("user_id"); // Retrieve user_id from sessionStorage

    if (!userId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    const responseObject = {
      userId, // Include user_id
      questionID: "1a",
      responses
    };

    try {
      // Submit the data to the API
      const res = await fetch("/api/saveResponses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) {
        throw new Error("Failed to save responses");
      }

      const selectedAreas = Object.keys(responses);

      // Navigate to follow-up question page
      router.push(
        `/survey/dataCollection/question1aFollowUp?areas=${encodeURIComponent(
          selectedAreas.join("|")
        )}`
      );
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 p-6 border border-blue-500 rounded-lg bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold"> National Level</h1>
          <li>
            Check if there is a documented set of rules or guidelines that
            dictate how data should be collected.
          </li>
          <li>
            Look for national or regional frameworks that outline data
            collection methods, formats, and timelines.
          </li>
        </ul>
      </div>

      <h1 className="text-xl font-bold mb-6">
        1.a: Are there national guidelines that specify how data should be
        collected across the sector?
      </h1>
      <form>
        {areas.map(area =>
          <div
            key={area}
            className={`mb-4 p-4 rounded-lg ${errors[area]
              ? "border-red-500 border"
              : "border-gray-300 border"}`}
          >
            <h3 className="font-semibold">
              {area}
            </h3>
            <div className="flex gap-4 mt-2">
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Yes"
                  checked={responses[area] === "Yes"}
                  onChange={() => handleChange(area, "Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Partially"
                  checked={responses[area] === "Partially"}
                  onChange={() => handleChange(area, "Partially")}
                />
                Partially
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="No"
                  checked={responses[area] === "No"}
                  onChange={() => handleChange(area, "No")}
                />
                No
              </label>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Question1a;
