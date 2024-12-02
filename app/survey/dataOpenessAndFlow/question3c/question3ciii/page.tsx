"use client"; // Ensure the code runs only client-side

import React, { useState } from "react";
import Link from "next/link"; // For navigation

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

const Question3ciii = () => {
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

  const [error, setError] = useState<string | null>(null); // State for error message

  // Handler to update responses when a user selects a radio button
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
    setError(null); // Clear error when a valid selection is made
  };

  // Validation and navigation handler
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if all areas have a response
    const allAnswered = Object.values(responses).every(
      response => response !== null
    );

    if (!allAnswered) {
      setError("Please answer all questions before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "3c.iii", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    // Send data to your API
    fetch("/api/saveDataOpenessAndFlow", {
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
        // Navigate to the next question if validation passes
        window.location.href =
          "/survey/dataOpenessAndFlow/question3c/question3civ";
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="survey-container p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Openness and Flow Assessment National Level
          </h1>
          <li>
            This question asks if your organisation has clear guidelines that
            promote making data freely available to everyone to use, modify, and
            distribute without restrictions, while ensuring that sensitive and
            private information is protected.
          </li>
        </ul>
      </div>
      <h1>
        3.c.iii Does your organisation have clear rules or policies for sharing
        data freely and publicly?
      </h1>

      <form>
        {areas.map(area =>
          <div key={area} className="mb-4 mt-4 area-section">
            <label className="area-label">
              <strong>
                {area}
              </strong>
            </label>
            <div className="options">
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

      {/* Error message */}
      {error &&
        <p className="text-red-500 mt-4">
          {error}
        </p>}

      {/* Next button */}
      <div className="navigation-buttons">
        <button
          onClick={handleNext}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question3ciii;
