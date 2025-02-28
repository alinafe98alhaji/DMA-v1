"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import Link from "next/link";

// Map response text to score
const responseToScoreMap: Record<string, number> = {
  "Very Poor: Difficult to integrate with existing systems due to technical mismatches.": 0.2,
  "Poor: Some standards and processes work, but many data sharing issues still occur.": 0.4,
  "Average: Poor collaboration between teams or departments in adopting and adapting these standards causing some data sharing issues.": 0.6,
  "Good: Standards and processes work well, with only a few data sharing problems.": 0.8,
  "Excellent: Standards and processes are very effective, ensuring smooth data sharing without problems.": 1.0
};

const Question3aiii = () => {
  const searchParams = useSearchParams();
  const responsesQuery = searchParams.get("responses");

  const [responses, setResponses] = useState<any>(null);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(
    () => {
      if (responsesQuery) {
        const parsedResponses = JSON.parse(responsesQuery);
        setResponses(parsedResponses);

        // Filter areas with Yes or Partially
        const areas = Object.keys(parsedResponses).filter(
          area =>
            parsedResponses[area] === "Yes" ||
            parsedResponses[area] === "Partially"
        );
        setFilteredAreas(areas);
      }
    },
    [responsesQuery]
  );

  // Handle Next button click with validation
  const handleNextClick = async (e: React.MouseEvent) => {
    // Prevent the default behavior to avoid navigation until validation
    e.preventDefault();

    const allAnswered = filteredAreas.every(area => {
      const selectedValue = document.querySelector(
        `input[name="${area}"]:checked`
      );
      return selectedValue !== null;
    });

    if (!allAnswered) {
      setError("Please respond to all areas before submitting.");
      return;
    }

    setError(""); // Clear error message if all are answered

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Prepare the responses including both response text and the corresponding score
    const answeredResponses = filteredAreas.map(area => {
      const responseText = responses[area];
      const score = responseToScoreMap[responseText]; // Get the numeric score based on the response
      return { area, response: responseText, score };
    });

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "3a.iii", // Adding questionID
      responses: answeredResponses
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
        // Proceed to the next page if validated
        const nextPageLink = `/survey/dataOpenessAndFlow/question3a/question3aiv?responses=${encodeURIComponent(
          JSON.stringify(responses)
        )}`;
        window.location.href = nextPageLink; // This replaces the Link component
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  // Handle radio button selection to clear error when selected
  const handleRadioChange = (area: string, value: string) => {
    setResponses((prev: any) => ({
      ...prev,
      [area]: value
    }));

    // Clear the error message when the user starts making a selection
    setError("");
  };

  if (!responses) return <div>Loading...</div>; // Wait until responses are loaded

  return (
    <div className="p-6 survey-container">
      <h1 className="mb-4 text-lg font-bold">Data Openness and Flow</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 text-lg font-bold mb-4">
          3.a.iii. How effective are sector standards and processes at
          facilitating sharing of data between different systems?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question assesses the effectiveness of the rules for helping
            different systems share and use data easily, and the processes which
            govern how data is shared.
          </li>
        </ul>
      </div>

      {/* Table layout */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Areas</th>
              <th className="border border-gray-300 p-2 text-center">
                Very Poor: Difficult to integrate with existing systems due to
                technical mismatches.
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Poor: Some standards and processes work, but many data sharing
                issues still occur.
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Average: Poor collaboration between teams or departments in
                adopting and adapting these standards causing some data sharing
                issues.
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Good: Standards and processes work well, with only a few data
                sharing problems.{" "}
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Excellent: Standards and processes are very effective, ensuring
                smooth data sharing without problems.
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAreas.map(area =>
              <tr key={area}>
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                <td className="hover:bg-blue-100 border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="0.2"
                    checked={
                      responses[area] ===
                      "Very Poor: Difficult to integrate with existing systems due to technical mismatches."
                    }
                    onChange={() =>
                      handleRadioChange(
                        area,
                        "Very Poor: Difficult to integrate with existing systems due to technical mismatches."
                      )}
                  />
                </td>
                <td className="hover:bg-blue-100 border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="0.4"
                    checked={
                      responses[area] ===
                      "Poor: Some standards and processes work, but many data sharing issues still occur."
                    }
                    onChange={() =>
                      handleRadioChange(
                        area,
                        "Poor: Some standards and processes work, but many data sharing issues still occur."
                      )}
                  />
                </td>
                <td className="hover:bg-blue-100 border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="0.6"
                    checked={
                      responses[area] ===
                      "Average: Poor collaboration between teams or departments in adopting and adapting these standards causing some data sharing issues."
                    }
                    onChange={() =>
                      handleRadioChange(
                        area,
                        "Average: Poor collaboration between teams or departments in adopting and adapting these standards causing some data sharing issues."
                      )}
                  />
                </td>
                <td className="hover:bg-blue-100 border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="0.8"
                    checked={
                      responses[area] ===
                      "Good: Standards and processes work well, with only a few data sharing problems."
                    }
                    onChange={() =>
                      handleRadioChange(
                        area,
                        "Good: Standards and processes work well, with only a few data sharing problems."
                      )}
                  />
                </td>
                <td className="hover:bg-blue-100 border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="1.0"
                    checked={
                      responses[area] ===
                      "Excellent: Standards and processes are very effective, ensuring smooth data sharing without problems."
                    }
                    onChange={() =>
                      handleRadioChange(
                        area,
                        "Excellent: Standards and processes are very effective, ensuring smooth data sharing without problems."
                      )}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {error &&
        <div className="mt-4 text-red-500">
          <p>
            {error}
          </p>
        </div>}

      {/* Next Button */}
      <button
        onClick={handleNextClick}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question3aiii />
  </Suspense>;

export default SuspenseWrapper;
