"use client"; // Ensure the code runs only client-side

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation"; // Correct hook for routing in App Router
export const dynamic = "force-dynamic";

// List of areas that need to be rendered for this question
const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

// Define the responses object type based on the areas
type Responses = {
  [key in typeof areas[number]]: "Yes" | "Partially" | "No" | null
};

const Question4a = () => {
  // Initialize state to track user responses for each area
  const [responses, setResponses] = useState<Responses>({
    "Urban Water Supply Coverage": null,
    "Urban Sanitation Sector Coverage": null,
    "Rural Water Supply Sector Coverage": null,
    "Rural Sanitation Sector Coverage": null,
    Finance: null,
    Regulation: null,
    "Utility Operations: Technical, Commercial, Financial, HR": null
  });

  // State to track validation error
  const [error, setError] = useState(false);

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Get router instance for navigation
  const router = useRouter();

  // Handler to update responses when a user selects a radio button
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({ ...prev, [area]: value }));
    setError(false); // Clear error when a valid selection is made
  };

  // Validation function to check if all responses are filled
  const isFormValid = () => {
    return Object.values(responses).every(response => response !== null);
  };

  // Handle form submission
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError(true);
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "4a", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: response ? responseScores[response] : 0 // Include the score
      }))
    };

    // Send data to your API
    fetch("/api/saveDataQuality", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(responseObject)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to save responses");
        }
        return res.json();
      })
      .then(data => {
        console.log("Responses saved successfully:", data);
        // Proceed to next question
        // Navigate to the next page if valid
        router.push("/survey/dataQuality/question4a/question4ai");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6 survey-container">
      <h1 className="mb-4 text-lg font-bold">Data Quality</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 mb-4 text-lg font-bold">
          4.a Is there an internal centralised process for verifying the quality
          of data?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            Check if there are established procedures for ongoing data quality
            assessment, such as regular audits, reviews, or quality checks.
          </li>
          <li>
            Look for guidelines that define how data quality is measured,
            including accuracy, completeness, consistency, and timeliness.
          </li>
        </ul>
      </div>

      <form onSubmit={handleNext}>
        {areas.map(area =>
          <div key={area} className="mb-4 mt-4 area-section">
            <label className="area-label">
              <strong>
                {area}
              </strong>
            </label>
            <div className="flex gap-4 options">
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

        {/* Error Message */}
        {error &&
          <p className="text-red-500 mt-2">
            Please answer all questions before proceeding.
          </p>}

        {/* Next button to navigate to the next page */}
        <div className="navigation-buttons">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question4a />
  </Suspense>;

export default SuspenseWrapper;
