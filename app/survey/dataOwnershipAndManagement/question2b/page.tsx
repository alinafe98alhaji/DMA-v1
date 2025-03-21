"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
const Question2b = () => {
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
    if (!responses[area]) {
      setErrorMessage(""); // Clear error message when user starts selecting
    }
    setResponses(prev => ({ ...prev, [area]: value }));
  };

  // Handle submission
  const handleSubmit = async () => {
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

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "2b", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };

    // Send data to your API
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
        // Proceed to next question
        // Filter areas with Yes/Partially/No for 2.b.i
        const areasFor2bi = areas.filter(
          area =>
            responses[area] === "Yes" ||
            responses[area] === "Partially" ||
            responses[area] === "No"
        );

        // Encode areas as JSON and pass it to 2.b.i
        router.push(
          `/survey/dataOwnershipAndManagement/question2b/question2bi?areas=${encodeURIComponent(
            JSON.stringify(areasFor2bi)
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
        <h1 className="text-lg text-gray-900 font-bold mb-4">
          2.b. Are there established consultation processes and forums where
          staff can discuss their data usage and requirements?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            Look for established processes or platforms that facilitate
            communication and coordination among staff regarding their data
            needs.
          </li>
          <li>
            Check if there are regular consultations, workshops, or forums where
            staff can express their data requirements.
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

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        Next
      </button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2b />
  </Suspense>;

export default SuspenseWrapper;
