"use client"; // Ensures the code runs only client-side

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question3biv = () => {
  const router = useRouter();

  // Predefined seven areas
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  // State to track user inputs for the areas
  const [answers, setAnswers] = useState(() =>
    areas.reduce((acc, area) => {
      acc[area] = null; // Initialize all answers as null
      return acc;
    }, {} as { [key: string]: "Yes" | "Partially" | "No" | null })
  );

  // State to handle error message visibility
  const [showError, setShowError] = useState(false);

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handler for updating user selections
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setAnswers(prev => ({ ...prev, [area]: value }));

    // Hide the error message when the user starts selecting
    if (showError) setShowError(false);
  };

  // Function to check if all required areas are answered
  const isValid = areas.every(area => answers[area] !== null);

  // Handle the "Next" button click with validation and navigation
  const handleNextClick = async () => {
    // If not all answers are provided, show the error message
    if (!isValid) {
      setShowError(true);
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Create response object only with the selected answers
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "3b.iv", // Adding questionID
      responses: Object.entries(answers).map(([area, response]) => ({
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
        const nextPage = "/survey/dataOpenessAndFlow/question3b/question3bv"; // Adjust next page path as needed
        const queryParams = new URLSearchParams({
          responses: JSON.stringify(answers)
        }).toString();

        router.push(`${nextPage}?${queryParams}`);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="survey-container p-6">
      <h1 className="mb-4 text-lg font-bold">Data Openness and Flow</h1>

      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h1 className="text-gray-900 text-lg font-bold mb-4">
          3.b.iv: Does your organisation make use of centralised platforms to
          share data internally?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question evaluates the practicality and implementation success
            of the technical systems for data sharing.
          </li>
        </ul>
      </div>

      {/* Error message */}
      {showError &&
        !isValid &&
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <strong>Error:</strong> Please answer all questions before proceeding.
        </div>}

      <form>
        {areas.map(area =>
          <div key={area} className="mb-4 mt-4 area-section">
            <label>
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
                  checked={answers[area] === "Yes"}
                  onChange={() => handleSelection(area, "Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Partially"
                  checked={answers[area] === "Partially"}
                  onChange={() => handleSelection(area, "Partially")}
                />
                Partially
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="No"
                  checked={answers[area] === "No"}
                  onChange={() => handleSelection(area, "No")}
                />
                No
              </label>
            </div>
          </div>
        )}
      </form>

      {/* Navigation Buttons */}
      <div className="navigation-buttons mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question3biv />
  </Suspense>;

export default SuspenseWrapper;
