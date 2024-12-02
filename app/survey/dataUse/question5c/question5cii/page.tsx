"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

const Question5cii = () => {
  const router = useRouter();

  // State to store responses for the areas
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Handler for radio button selection
  const handleSelection = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error message if the user starts making a selection
    setError("");
  };

  // Handle the next button click
  const handleNext = () => {
    // Check if all areas have a selection
    const unansweredAreas = areas.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if there are unanswered areas
      setError("Please make a selection for all areas before proceeding.");
      return;
    }

    // Clear error if all areas are answered
    setError("");

    // Filter areas based on "Yes", "Partially", "No" responses
    const areasFor5civ = Object.keys(responses).filter(
      area => responses[area] === "Yes"
    );
    const areasFor5ciii = Object.keys(responses).filter(
      area => responses[area] === "Partially" || responses[area] === "No"
    );

    // Pass the areas to 5.c.iii via query parameters
    router.push(
      `/survey/dataUse/question5c/question5ciii?areasFor5civ=${encodeURIComponent(
        JSON.stringify(areasFor5civ)
      )}&areasFor5ciii=${encodeURIComponent(JSON.stringify(areasFor5ciii))}`
    );
  };

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Use Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation uses the established
            KPIs to track and evaluate its performance.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        5.c.ii: Does your organisation use these KPIs for performance
        monitoring?
      </h1>

      {areas.map(area =>
        <div key={area} className="mb-4">
          <label className="block font-semibold mb-2">
            {area}
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleSelection(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleSelection(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleSelection(area, "No")}
              />
              No
            </label>
          </div>
        </div>
      )}

      {/* Display error message if there are unanswered areas */}
      {error &&
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>}

      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Question5cii;
