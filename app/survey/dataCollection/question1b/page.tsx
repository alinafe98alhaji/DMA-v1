"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question1b = () => {
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
  const [error, setError] = useState<string>(""); // Error state for validation

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle selection
  const handleSelection = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    // Clear error message if any option is selected
    if (error) {
      setError("");
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    // Check if all areas have been answered
    if (Object.keys(responses).length !== areas.length) {
      setError("Please respond to all areas before proceeding.");
      return; // Stop submission if any area is unanswered
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with question ID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "1b",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };
    console.log("1b Responses:", responseObject);

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
        // Filter areas with Yes/Partially for 1.b.i
        const areasFor1bi = areas.filter(
          area => responses[area] === "Yes" || responses[area] === "Partially"
        );

        // Navigate to 1.b.i with filtered areas
        router.push(
          `/survey/dataCollection/question1b/question1bi?pageData=${encodeURIComponent(
            JSON.stringify(areasFor1bi)
          )}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data collection</h1>

      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 text-lg font-bold mb-4">
          1.b: Is there a process/procedure for ensuring that data is collected
          universally/inclusively across the organisation?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            Look for established processes or protocols that ensure data is
            collected from all regions and populations, including marginalised
            or hard-to-reach groups.
          </li>
          <li>
            Assess whether there are measures to address potential gaps in data
            collection coverage.
          </li>
        </ul>
      </div>

      {/* Render areas */}
      {areas.map(area =>
        <div className="mt-4 mb-4" key={area}>
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
      {error &&
        <p className="text-red-500">
          {error}
        </p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Question1b;
