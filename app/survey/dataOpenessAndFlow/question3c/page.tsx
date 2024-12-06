"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question3c = () => {
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
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null); // State for validation error

  // Handle selection changes
  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
    setError(null); // Clear error when a valid selection is made
  };

  // Handle submission
  const handleSubmit = async () => {
    // Check if all areas have a response
    const allAnswered = areas.every(area => responses[area]);
    if (!allAnswered) {
      setError("Please select an option for all areas before proceeding.");
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
      questionID: "3c", // Adding questionID
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
        // Navigate to the follow-up question with the selected areas
        const selectedAreas = Object.entries(responses)
          .filter(
            ([_, value]) =>
              value === "Yes" || value === "Partially" || value === "No"
          )
          .map(([key]) => key);

        router.push(
          `/survey/dataOpenessAndFlow/question3cFollowUp?areas=${encodeURIComponent(
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
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Openness and Flow Assessment National Level
          </h1>
          <li>
            Look for documented open data policies that outline the principles
            of data transparency, accessibility, and reuse.
          </li>
          <li>
            Check if these policies define which data should be openly shared
            and under what conditions, as well as any restrictions on sensitive
            or private data.
          </li>
        </ul>
      </div>
      <h1>
        3.c: Are there clear rules, guidelines or policies in the WSS sector for
        sharing data publicly?
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
        {error &&
          <p className="text-red-500">
            {error}
          </p>}{" "}
        {/* Display validation error */}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Question3c;
