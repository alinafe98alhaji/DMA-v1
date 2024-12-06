"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question2aiii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 2.a.ii
  const areasFor2aiii: string[] = JSON.parse(
    searchParams.get("pageData") || "[]"
  );

  // Define 5-option radio values
  const options = [
    "No clear data ownership principles. Stakeholders are not adequately informed or trained on the importance and application of these principles.",
    "Basic principles outlined, but with ambiguous language, causing some confusion.",
    "Better definition and communication of ownership principles, with some enforcement issues.",
    "Strong principles recognised by most, with occasional minor disagreements.",
    "Fully established and respected principles, effectively eliminating any disagreements."
  ];

  // Define the scores for each option with explicit types
  const scores: { [key: string]: number } = {
    "No clear data ownership principles. Stakeholders are not adequately informed or trained on the importance and application of these principles.": 0.2,
    "Basic principles outlined, but with ambiguous language, causing some confusion.": 0.4,
    "Better definition and communication of ownership principles, with some enforcement issues.": 0.6,
    "Strong principles recognised by most, with occasional minor disagreements.": 0.8,
    "Fully established and respected principles, effectively eliminating any disagreements.": 1
  };

  // State to track responses
  const [responses, setResponses] = useState<{ [area: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle selection
  const handleSelection = (area: string, value: string) => {
    if (!responses[area]) {
      setErrorMessage(""); // Clear error message when user starts selecting
    }
    setResponses(prev => ({ ...prev, [area]: value }));
  };

  // Handle submission
  const handleSubmit = async () => {
    // Check if all areas have a response
    if (Object.keys(responses).length !== areasFor2aiii.length) {
      setErrorMessage("Please respond to all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Filter valid responses and include the scores
    const filteredResponses = Object.entries(responses)
      .filter(([_, response]) => response) // Ensure the response is not empty
      .map(([area, response]) => ({
        area,
        response,
        score: scores[response] // Add the score for each response
      }));

    // Prepare the payload
    const responseObject = {
      userId: userId_ses,
      questionID: "2a.iii",
      responses: filteredResponses,
      submittedAt: new Date().toISOString() // Optional timestamp
    };

    console.log("Filtered Response Payload:", responseObject); // Debugging

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
        // Navigate to the next question
        router.push("/survey/dataOwnershipAndManagement/question2b");
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
            This question examines why or why not your organisation follows the
            established guidelines on data ownership.
          </li>
        </ul>
      </div>
      <h1>
        2.a.iii: How effective are these data ownership rules at establishing
        clear and undisputed ownership of data?
      </h1>

      {/* Render in Tabular Format with Options as Columns */}
      <table className="table-auto w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Area</th>
            {options.map(option =>
              <th key={option} className="px-4 py-2 border">
                {option}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areasFor2aiii.map((area: string) =>
            <tr key={area}>
              <td className="border px-4 py-2">
                {area}
              </td>
              {options.map(option =>
                <td key={option} className="border px-4 py-2">
                  <label>
                    <input
                      type="radio"
                      name={area}
                      value={option}
                      onChange={() => handleSelection(area, option)}
                      checked={responses[area] === option}
                    />
                  </label>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      {/* Error Message */}
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </div>
  );
};

export default Question2aiii;
