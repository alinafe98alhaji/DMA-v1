"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question1bi = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 1.b
  const areasFor1bi: string[] = JSON.parse(
    searchParams.get("pageData") || "[]"
  );

  // State to track responses
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
    if (Object.keys(responses).length !== areasFor1bi.length) {
      setError("Please respond to all areas before proceeding.");
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
      questionID: "1b.i", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };
    console.log("1b.i Responses:", responseObject); // Log for debugging

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
        // Navigate to 1.b.ii with filtered areas
        router.push(
          `/survey/dataCollection/question1b/question1bii?pageData=${encodeURIComponent(
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
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold"> Organisational Level</h1>
          <li>
            This question examines if your organisation follows the guidelines
            for inclusive data collection.
          </li>
        </ul>
      </div>
      <h1>
        1.b.i: Does your organisation collect data in line with this process?
      </h1>

      {/* Render areas */}
      {areasFor1bi.map((area: string) =>
        <div className="mt-4 mb-4" key={area}>
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

export default Question1bi;
