"use client"; // Ensure the code runs only client-side

import React, { useState, Suspense } from "react";
import Link from "next/link"; // For navigation
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

const Question5bii = () => {
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

  // Handler to update responses when a user selects a radio button
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({ ...prev, [area]: value }));
  };

  // Check if all areas have been answered
  const isFormComplete = Object.values(responses).every(
    response => response !== null
  );

  return (
    <div className="survey-container p-6">
      <h1 className="mb-4 text-lg font-bold">Data Use</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 font-bold text-lg mb-4">
          5.b.ii Does your organisation benefit from external incentives to
          promote data-driven decision making?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question examines if your organisation takes advantage of these
            incentives to enhance its decision-making processes.
          </li>
        </ul>
      </div>

      <form>
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
      </form>

      {/* Next button to navigate to the next page */}
      <div className="navigation-buttons mt-6">
        <Link href="/survey/dataUse/question5c/question5cii">
          <button
            type="button"
            disabled={!isFormComplete} // Disable the button if the form is not complete
            onClick={async () => {
              // Retrieve user_id from sessionStorage
              const userId_ses = sessionStorage.getItem("user_id");

              if (!userId_ses) {
                alert(
                  "User ID is missing. Please return to the basic details page."
                );
                return;
              }

              // Map responses to scores
              const responseScores: Record<string, number> = {
                Yes: 1,
                Partially: 0.5,
                No: 0
              };

              // Log responses with questionID
              const responseObject = {
                userId: userId_ses,
                questionID: "5b.ii", // Adding questionID
                responses: Object.entries(
                  responses
                ).map(([area, response]) => ({
                  area,
                  response,
                  score: response ? responseScores[response] : 0 // Include the score
                }))
              };

              // Send data to your API
              fetch("/api/saveDataUse", {
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
                  //router.push("/survey/dataUse/question5b/question5bi");
                })
                .catch(err => {
                  console.error("Error saving responses:", err);
                });
            }}
            className={`w-full py-2 px-4 rounded-md transition duration-300 ${isFormComplete
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question5bii />
  </Suspense>;

export default SuspenseWrapper;
