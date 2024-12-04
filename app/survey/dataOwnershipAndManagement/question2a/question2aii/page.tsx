"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Question2aii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 2.a.i
  const areasFor2aii: string[] = JSON.parse(
    searchParams.get("pageData") || "[]"
  );

  // State to track responses
  const [responses, setResponses] = useState<{ [area: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle selection
  const handleSelection = (area: string, value: string) => {
    if (!responses[area]) {
      setErrorMessage(""); // Clear error message when user starts selecting
    }
    setResponses(prev => ({ ...prev, [area]: value }));
  };

  // Handle submission
  const handleSubmit = async () => {
    // Ensure all required areas have responses
    if (Object.keys(responses).length !== areasFor2aii.length) {
      setErrorMessage("Please respond to all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Filter only areas with valid responses
    const filteredResponses = Object.entries(responses)
      .filter(([_, response]) => response) // Ensure the response is not empty or undefined
      .map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }));

    const responseObject = {
      userId: userId_ses,
      questionID: "2a.ii",
      responses: filteredResponses,
      submittedAt: new Date().toISOString() // Optional: Add a timestamp
    };

    console.log("Filtered Response Payload:", responseObject); // Debugging

    // Send filtered data to your API
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

        // Navigate to the next question
        router.push(
          `/survey/dataOwnershipAndManagement/question2a/question2aiii?pageData=${encodeURIComponent(
            JSON.stringify(areasFor2aii)
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
            Data Ownership and Management Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation follows the established
            guidelines on data ownership.
          </li>
        </ul>
      </div>
      <h1>2.a.ii: Does your organisation follow these data ownership rules?</h1>

      {/* Render areas */}
      {areasFor2aii.map((area: string) =>
        <div className="mb-4 mt-4" key={area}>
          <p>
            {area}
          </p>
          <div>
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
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default Question2aii;
