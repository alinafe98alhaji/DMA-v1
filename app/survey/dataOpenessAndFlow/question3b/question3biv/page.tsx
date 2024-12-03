"use client"; // Ensures the code runs only client-side

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Question3biv = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const responsesQuery = searchParams.get("responses");
  const responses = responsesQuery
    ? JSON.parse(decodeURIComponent(responsesQuery))
    : {};

  // Filter areas where the previous response was "No"
  const noAreas = Object.entries(responses)
    .filter(([_, value]) => value === "No")
    .map(([area]) => area);

  // State to track user inputs for the filtered areas
  const [answers, setAnswers] = useState(() =>
    noAreas.reduce((acc, area) => {
      acc[area] = null; // Initialize all answers as null
      return acc;
    }, {} as { [key: string]: "Yes" | "Partially" | "No" | null })
  );

  // State to handle error message visibility
  const [showError, setShowError] = useState(false);

  // Handler for updating user selections
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setAnswers(prev => ({ ...prev, [area]: value }));

    // Hide the error message when the user starts selecting
    if (showError) setShowError(false);
  };

  // Function to check if all required areas are answered
  const isValid = noAreas.every(area => answers[area] !== null);

  // Handle the "Next" button click with validation and navigation
  const handleNextClick = async () => {
    // If not all answers are provided, show the error message
    if (!isValid) {
      setShowError(true);
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Create response object only with the selected answers
    const responseObject = {
      userId: userId_ses,
      questionID: "3b.iv", // Adding questionID
      responses: Object.entries(answers).map(([area, response]) => ({
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
        // Navigate to the next page if valid
        const nextPage = "/survey/dataOpenessAndFlow/question3b/question3bv"; // Adjust next page path as needed
        const queryParams = new URLSearchParams({
          responses: JSON.stringify({ ...responses, ...answers })
        }).toString();

        router.push(`${nextPage}?${queryParams}`);
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
            Data Openness and Flow Assessment Organisational Level
          </h1>
          <li>
            This question evaluates the practicality and implementation success
            of the technical systems for data sharing.
          </li>
        </ul>
      </div>

      <h1>
        3.b.iv. Does your organisation make use of centralised platforms to
        share data internally?
      </h1>

      {/* Error message */}
      {showError &&
        !isValid &&
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <strong>Error:</strong> Please answer all questions before proceeding.
        </div>}

      {noAreas.length === 0
        ? <p>No areas marked as "No" from the previous step.</p>
        : <form>
            {noAreas.map(area =>
              <div key={area} className="mb-4 mt-4 area-section">
                <label>
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
          </form>}

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default Question3biv;
