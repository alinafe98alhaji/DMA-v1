"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Question3a = () => {
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
  const [error, setError] = useState<string>("");

  // Handle selection changes
  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
  };

  // Validation check
  const validateForm = () => {
    // Check if any area is left unanswered
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setError("Please answer all questions.");
      return false;
    }
    setError("");
    return true;
  };

  // Handle submission
  const handleSubmit = async () => {
    // Perform validation
    if (!validateForm()) {
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
      questionID: "3a", // Adding questionID
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
        // Filter areas with Yes or Partially selected
        const selectedAreas = Object.entries(responses)
          .filter(
            ([_, value]) =>
              value === "Yes" || value === "Partially" || value === "No"
          )
          .map(([key]) => key);

        // Navigate to the follow-up question with the selected areas
        router.push(
          `/survey/dataOpenessAndFlow/question3aFollowUp?areas=${encodeURIComponent(
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
            Data Openess and Flow Assessment National Level
          </h1>
          <li>
            Check if there are documented data models and metadata standards
            that ensure data collected from various sources can be easily
            combined and understood.
          </li>
          <li>
            Look for documented protocols that detail the processes for data
            sharing, including data access permissions, transfer methods, and
            security measures.
          </li>
          <li>
            Look for guidelines that define how data should be formatted,
            labelled, and structured to support interoperability.
          </li>
        </ul>
      </div>
      <h1>
        3.a: Are there established rules and regular processes for data sharing
        across different systems in the WSS sector (interoperability support)?
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
          </p>}
        <button type="button" onClick={handleSubmit}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Question3a;
