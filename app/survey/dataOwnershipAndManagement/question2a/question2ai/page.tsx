"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question2ai = () => {
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
  const [responses, setResponses] = useState<{ [area: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle selection
  const handleSelection = (area: string, value: string) => {
    // Clear error message when user starts selecting
    if (!responses[area]) {
      setErrorMessage(""); // Clear error message
    }

    setResponses(prev => ({ ...prev, [area]: value }));
  };

  const handleSubmit = async () => {
    // Check if all areas have responses
    if (Object.keys(responses).length !== areas.length) {
      setErrorMessage("Please respond to all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Filter to only include areas that have been responded to
    const filteredResponses = Object.entries(responses)
      .filter(([_, response]) => response) // Ensure response is not empty
      .map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }));

    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "2a.i",
      responses: filteredResponses,
      submittedAt: new Date().toISOString() // Optional: add a timestamp
    };

    console.log("Filtered Response Payload:", responseObject); // Debugging

    // Send filtered data to your API
    fetch("/api/saveDataOwnershipAndManagement", {
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

        // Filter areas with Yes/Partially for 2.a.ii
        const areasFor2aii = Object.keys(responses).filter(
          area => responses[area] === "Yes" || responses[area] === "Partially"
        );

        // Navigate to 2.a.ii with filtered areas
        router.push(
          `/survey/dataOwnershipAndManagement/question2a/question2aii?pageData=${encodeURIComponent(
            JSON.stringify(areasFor2aii)
          )}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data Ownership and Management</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="font-bold text-gray-900 text-lg mb-4">
          2.a.i Is your organisation aware of centrally agreed upon rules for
          who owns the data in the sector?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question asks if your organisation knows about clear guidelines
            on who owns the data collected within the water and sanitation
            sector.
          </li>
        </ul>
      </div>

      {/* Render areas */}
      {areas.map(area =>
        <div className="mb-4 mt-4" key={area}>
          <p className="font-bold">
            {area}
          </p>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                onChange={() => handleSelection(area, "Yes")}
                checked={responses[area] === "Yes"}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                onChange={() => handleSelection(area, "Partially")}
                checked={responses[area] === "Partially"}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                onChange={() => handleSelection(area, "No")}
                checked={responses[area] === "No"}
              />
              No
            </label>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2ai />
  </Suspense>;

export default SuspenseWrapper;
