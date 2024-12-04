"use client"; // Ensure the code is only executed client-side

import React, { useState } from "react";
import Link from "next/link";

// List of areas for which the user can select Yes/Partially/No
const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

type Responses = {
  [key: string]: "Yes" | "Partially" | "No" | null;
};

const Question3bii = () => {
  // State to track user selections for Yes/Partially/No
  const [responses, setResponses] = useState<Responses>(() =>
    areas.reduce((acc, area) => {
      acc[area] = null;
      return acc;
    }, {} as Responses)
  );
  const [error, setError] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (error) setError(""); // Clear error on new selection
  };

  const handleSubmit = async () => {
    // Check if all areas have a selection
    const allAnswered = areas.every(area => responses[area] !== null);

    if (!allAnswered) {
      setError("Please provide a response for all areas before proceeding.");
      return; // Stop navigation if validation fails
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
      questionID: "3b.ii", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: response ? responseScores[response] : 0 // Include the score
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
        // If validation passes, navigate to the next page
        const query = { responses: JSON.stringify(responses) };
        window.location.href = `/survey/dataOpenessAndFlow/question3b/question3biii?${new URLSearchParams(
          query
        )}`;
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
            Data Openess and Flow Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation utilises the provided
            technical platforms for sharing data.
          </li>
        </ul>
      </div>

      <h1>
        3.b.ii Does your organisation make use of centralised platforms to share
        data at sector level?
      </h1>
      <p>
        Please respond for each area below. Select <strong>Yes = 1</strong>,{" "}
        <strong>Partially = 0.5</strong>, or <strong>No = 0</strong>.
      </p>
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
                  value="Yes = 1"
                  onChange={() => handleSelection(area, "Yes")}
                  checked={responses[area] === "Yes"}
                />
                Yes
              </label>
              <label>
                <input
                  style={{ marginLeft: "30px" }}
                  type="radio"
                  name={area}
                  value="Partially = 0.5"
                  onChange={() => handleSelection(area, "Partially")}
                  checked={responses[area] === "Partially"}
                />
                Partially
              </label>
              <label>
                <input
                  style={{ marginLeft: "30px" }}
                  type="radio"
                  name={area}
                  value="No = 0"
                  onChange={() => handleSelection(area, "No")}
                  checked={responses[area] === "No"}
                />
                No
              </label>
            </div>
          </div>
        )}
      </form>

      {/* Display error message */}
      {error &&
        <p className="text-red-500 mt-4">
          {error}
        </p>}

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question3bii;
