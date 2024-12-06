"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question1dii = () => {
  const router = useRouter();

  // Define the areas of interest
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  // State to store responses and validation error
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>(""); // For validation errors

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle option change (update responses state)
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error if a valid option is selected
    if (error) setError("");
  };

  // Handle "Next" button click
  const handleNext = async () => {
    // Validate if all areas have been answered
    const allAnswered = areas.every(area => responses[area]);
    if (!allAnswered) {
      setError("Please select an option for all areas before proceeding.");
      return; // Prevent navigation
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
      questionID: "1d.ii", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };

    // Send data to your API
    fetch("/api/saveResponses", {
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
        // Separate areas into two groups
        const areasFor1diii = areas.filter(
          area => responses[area] === "Yes" || responses[area] === "Partially"
        );
        const areasFor1dv = areas.filter(area => responses[area] === "No");

        // Pass data to 1.d.iii using URL query parameters
        router.push(
          `/survey/dataCollection/question1d/question1diii?areasFor1diii=${encodeURIComponent(
            JSON.stringify(areasFor1diii)
          )}&areasFor1dv=${encodeURIComponent(JSON.stringify(areasFor1dv))}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Collection Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation is aware of nationally
            provided digital tools for collecting data.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        1.d.ii: Is your organisation aware of centrally/nationally developed
        standardised digital tools for data collection?
      </h1>
      {areas.map(area =>
        <div key={area} className="mb-4">
          <label className="block font-semibold mb-2">
            {area}
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleOptionChange(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleOptionChange(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleOptionChange(area, "No")}
              />
              No
            </label>
          </div>
        </div>
      )}
      {error &&
        <p className="text-red-500 mt-4">
          {error}
        </p>}{" "}
      {/* Display error message */}
      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question1dii />
  </Suspense>;

export default SuspenseWrapper;
