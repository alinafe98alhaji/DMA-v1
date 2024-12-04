"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Question1aii = () => {
  const router = useRouter();

  // Define the areas of interest
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  // State to store responses and validation errors
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle option change (update responses state)
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    setErrors(prev => ({ ...prev, [area]: false })); // Clear errors when user selects a value
  };

  // Handle "Next" button click
  const handleNext = async () => {
    const newErrors: Record<string, boolean> = {};
    let hasErrors = false;

    // Check if all areas have a response
    areas.forEach(area => {
      if (!responses[area]) {
        newErrors[area] = true;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      alert("Please select a response for all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Prepare responses with scores
    const responseObject = {
      userId, // Include user_id
      questionID: "1a.ii",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };

    try {
      // Save responses via API
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

      // Separate areas into two groups
      const areasFor1aiii = areas.filter(
        area => responses[area] === "Yes" || responses[area] === "Partially"
      );
      const areasFor1av = areas.filter(area => responses[area] === "No");

      // Pass data to 1.a.iii using URL query parameters
      router.push(
        `/survey/dataCollection/question1a/question1aiii?areasFor1aiii=${encodeURIComponent(
          JSON.stringify(areasFor1aiii)
        )}&areasFor1av=${encodeURIComponent(JSON.stringify(areasFor1av))}`
      );
    } catch (error) {
      console.error("Error saving follow-up responses:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">Organisational Level</h1>
          <li>
            Are there national or regional frameworks that outline data
            collection methods, formats, and timelines?
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        1.a.ii: Is your organisation aware of national guidelines that specify
        how data should be collected?
      </h1>
      {areas.map(area =>
        <div key={area} className="mb-4">
          <label
            className={`block font-semibold mb-2 ${errors[area]
              ? "text-red-500"
              : ""}`}
          >
            {area}
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleOptionChange(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleOptionChange(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleOptionChange(area, "No")}
              />
              No
            </label>
          </div>
          {errors[area] &&
            <p className="text-red-500 text-sm mt-2">
              Please select a response for this area.
            </p>}
        </div>
      )}
      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Question1aii;
