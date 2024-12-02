"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Question3b = () => {
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

  // State to track responses for each area and error message
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Handle selection changes
  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear error message when a selection is made
    if (error) setError("");
  };

  // Handle submission
  const handleSubmit = async () => {
    // Validate that all areas are answered
    const allAnswered = areas.every(area => responses[area]);

    if (!allAnswered) {
      setError("Please answer all questions before proceeding.");
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
      questionID: "3b", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
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
        // Filter areas with Yes, Partially, or No selected
        const selectedAreas = Object.entries(responses)
          .filter(
            ([_, value]) =>
              value === "Yes" || value === "Partially" || value === "No"
          )
          .map(([key]) => key);

        // Navigate to the follow-up question with the selected areas
        router.push(
          `/survey/dataOpenessAndFlow/question3bFollowUp?areas=${encodeURIComponent(
            selectedAreas.join("|")
          )}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-9">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Openess and Flow Assessment National Level
          </h1>
          <li>
            Check if there are centralised systems, such as databases, data
            warehouses, or data exchange platforms, that support data sharing.
          </li>
          <li>
            Look for systems that provide functionalities for data integration,
            access control, and secure data transfer.
          </li>
        </ul>
      </div>
      <h1>
        3.b: Are there centralised digital platforms/systems that help
        consolidate, share and manage WSS data?
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

        {/* Display error message if validation fails */}
        {error &&
          <p className="text-red-500">
            {error}
          </p>}

        <button type="button" onClick={handleSubmit}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Question3b;
