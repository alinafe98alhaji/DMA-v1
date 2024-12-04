"use client"; // Ensure the code is only executed client-side

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

// List of areas for which the user can select Yes/Partially/No
const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

type Responses = {
  [key: string]: "Yes" | "Partially" | "No" | null;
};

const Question1C = () => {
  const router = useRouter(); // Initialize router
  // State to track user selections for Yes/Partially/No
  const [responses, setResponses] = useState<Responses>(() =>
    areas.reduce((acc, area) => {
      acc[area] = null;
      return acc;
    }, {} as Responses)
  );

  // Error message state
  const [error, setError] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle selection
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({ ...prev, [area]: value }));
    // Clear error message when a selection is made
    if (error) {
      setError("");
    }
  };

  // Handle next button click and log final responses
  const handleNextClick = async () => {
    // Check if all areas have been answered
    if (Object.values(responses).includes(null)) {
      setError("Please respond to all areas before submitting.");
      return; // Stop submission if any area is unanswered
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
      questionID: "1c", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: response ? responseScores[response] : 0 // Include the score
      }))
    };

    console.log("Question 1c: Final Responses Before Navigation", {
      questionID: "1c",
      responses
    });

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

        // Construct query string
        const query = new URLSearchParams({
          responses: JSON.stringify(responses)
        }).toString();

        // Use the constructed query string in the path
        router.push(`/survey/dataCollection/question1c/question1ci?${query}`);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6 survey-container">
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
            Check if there are documented plans or policies that outline how
            data collection will be sustained financially, technically, and
            institutionally.
          </li>
          <li>
            Look for long-term commitments or funding mechanisms that support
            continuous data collection.
          </li>
        </ul>
      </div>
      <h1>
        1.c. Are there financial and technical resources allocated to ensure
        data collection continues smoothly over time across the organisation?
      </h1>
      <p>
        Please respond for each area below. Select <strong>Yes</strong>,{" "}
        <strong>Partially</strong>, <strong>or No</strong>.
      </p>
      <form>
        {areas.map(area =>
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

      {/* Display Error Message */}
      {error &&
        <p className="text-red-500">
          {error}
        </p>}

      {/* Submit Button */}
      <div className="navigation-buttons">
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default Question1C;
