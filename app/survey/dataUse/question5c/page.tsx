"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Question5c = () => {
  const router = useRouter();

  // Seven areas of interest
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  // State to track responses for each area
  const [responses, setResponses] = useState<Record<string, string>>({});
  // State to manage the error message
  const [error, setError] = useState<string>("");

  // Handle selection changes
  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Check if all areas have been answered
    const unansweredAreas = areas.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if there are unanswered areas
      setError("Please answer all questions before proceeding.");
      return;
    }

    // Clear the error if all areas are answered
    setError("");

    // Filter areas with Yes, Partially, or No selected
    const selectedAreas = Object.entries(responses)
      .filter(
        ([_, value]) =>
          value === "Yes" || value === "Partially" || value === "No"
      )
      .map(([key]) => key);

    // Navigate to the follow-up question with the selected areas
    router.push(
      `/survey/dataUse/question5cFollowUp?areas=${encodeURIComponent(
        selectedAreas.join("|")
      )}`
    );
  };

  // Use effect to clear error message when responses change
  useEffect(
    () => {
      // Check if any responses were made to reset the error
      if (Object.values(responses).some(response => response !== undefined)) {
        setError("");
      }
    },
    [responses]
  );

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Use Assessment National Level
          </h1>
          <li>
            Check if there are documented KPIs that have been established for
            measuring performance in the water and sanitation sector. These
            should cover various aspects such as service delivery, financial
            performance, and customer satisfaction.
          </li>
          <li>
            Look for consistency in the use of these KPIs across different
            regions and organisations to ensure comparability and benchmarking.
          </li>
        </ul>
      </div>
      <h1>5.c: Are there established, standard, sector-wide KPIs?</h1>
      <form>
        {areas.map(area =>
          <div key={area} style={{ marginBottom: "20px", marginTop: "20px" }}>
            <h3>
              {area}
            </h3>
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
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleChange(area, "Partially")}
              />
              Partially
            </label>
            <label style={{ marginLeft: "10px" }}>
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
        )}

        {/* Display error message if there are unanswered areas */}
        {error &&
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>}

        {/* Next button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Question5c;
