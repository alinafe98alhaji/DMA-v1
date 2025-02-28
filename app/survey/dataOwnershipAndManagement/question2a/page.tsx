"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

// Define the seven areas
const AREAS = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

const Question2A = () => {
  const [responses, setResponses] = useState<Record<string, string | null>>(
    AREAS.reduce((acc, area) => {
      acc[area] = null;
      return acc;
    }, {} as Record<string, string | null>)
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  // Handle selection for each area

  const handleSelection = (area: string, value: string) => {
    // Clear error message when the user starts selecting
    if (!responses[area]) {
      setErrorMessage(""); // Clear error message
    }

    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
  };

  // Navigate to 2.a.i
  const handleNext = async () => {
    // Ensure all areas have been answered
    const allAnswered = Object.values(responses).every(
      response => response !== null
    );

    if (!allAnswered) {
      setErrorMessage("Please answer all the questions before proceeding.");
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
      questionID: "2a", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    // Send data to your API
    fetch("/api/nationalLevel", {
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
        // Proceed to the next page if all questions are answered
        router.push(
          "/survey/dataOwnershipAndManagement/question2a/question2ai"
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };
  return (
    <div className="p-6 survey-container">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1>
          2.a. Are there centrally agreed upon rules for who owns the data in
          the sector?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Ownership and Management Assessment National Level
          </h1>
          <li>
            Check if there are specific policies or legal documents that define
            who has the rights to access, use, and manage the data.
          </li>
          <li>
            Look for agreements or frameworks that outline the responsibilities
            of different stakeholders regarding data ownership.
          </li>
        </ul>
      </div>

      <form>
        {AREAS.map(area =>
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
      </form>

      {/* Error Message */}
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      {/* Next Button */}
      <div className="navigation-buttons">
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2A />
  </Suspense>;

export default SuspenseWrapper;
