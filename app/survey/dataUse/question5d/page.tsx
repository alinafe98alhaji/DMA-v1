"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Question5d = () => {
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

  // State to track responses for each area and the error message
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Handle selection changes
  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear error message when a response is selected
    setError("");
  };

  // Handle submission
  const handleSubmit = () => {
    // Check if all areas have been answered
    const unansweredAreas = areas.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if any area is unanswered
      setError("Please provide a response for all areas before proceeding.");
      return;
    }

    // Clear error if all areas are answered
    setError("");

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "5d", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
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
        // Filter areas with Yes, Partially, or No selected
        const selectedAreas = Object.entries(responses)
          .filter(
            ([_, value]) =>
              value === "Yes" || value === "Partially" || value === "No"
          )
          .map(([key]) => key);

        // Navigate to the follow-up question with the selected areas
        router.push(
          `/survey/dataUse/question5dFollowUp?areas=${encodeURIComponent(
            selectedAreas.join("|")
          )}`
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
            Data Use Assessment National Level
          </h1>
          <li>
            Check if there are documented training programmes that cover the
            entire data lifecycle, from collection to analysis and use.
          </li>
          <li>
            Look for consistent and ongoing capacity building efforts across
            different organisations and regions to ensure that staff have the
            necessary skills and knowledge.
          </li>
        </ul>
      </div>
      <h1>
        5.d: Is there a formalised approach to training and capacity development
        for data-related aspects in the WSS sector?
      </h1>
      <form>
        {areas.map(area =>
          <div key={area} style={{ marginBottom: "20px", marginTop: "20px" }}>
            <h3>
              {area}
            </h3>
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleChange(area, "Yes")}
              />
              Yes
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleChange(area, "Partially")}
              />
              Partially
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleChange(area, "No")}
              />
              No
            </label>
          </div>
        )}

        {/* Display error message if there are unanswered areas */}
        {error &&
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>}

        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Question5d;
