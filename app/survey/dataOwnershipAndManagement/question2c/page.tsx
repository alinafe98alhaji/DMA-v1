"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Question2c = () => {
  const router = useRouter();

  // Areas of interest
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
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle selection changes
  const handleChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear the error message if the user selects a value
    if (value !== "") {
      setErrorMessage("");
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    // Check if any area is unanswered
    for (const area of areas) {
      if (!responses[area]) {
        setErrorMessage("Please provide a response for all areas.");
        return;
      }
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
      questionID: "2c", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
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

        // Filter areas with Yes, Partially, or No selected
        const selectedAreas = Object.entries(responses)
          .filter(
            ([_, value]) =>
              value === "Yes" || value === "Partially" || value === "No"
          )
          .map(([key]) => key);

        // Navigate to the follow-up question with the selected areas
        router.push(
          `/survey/dataOwnershipAndManagement/question2cFollowup?areas=${encodeURIComponent(
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
            Data Ownership and Management Assessment National Level
          </h1>
          <li>
            Check if there are documented data protection policies that outline
            how data should be handled, stored, and shared to protect its
            integrity and confidentiality.
          </li>
          <li>
            Check if data is safe from loss, theft, or damage and make sure it
            stays private.
          </li>
          <li>
            Look for enforcement mechanisms, such as audits or compliance
            checks, to ensure these principles are adhered to.
          </li>
        </ul>
      </div>
      <h1>
        2.c: Are there clear rules for data protection and security in the WSS
        sector?
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

        {/* Display error message if any area is unanswered */}
        {errorMessage &&
          <div className="text-red-500 mt-4">
            {errorMessage}
          </div>}

        <button type="button" onClick={handleSubmit}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Question2c;
