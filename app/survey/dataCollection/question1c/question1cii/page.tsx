"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question1CII = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const responsesQuery = searchParams.get("responses");

  const [responses, setResponses] = useState<any>(null);
  const [noAreas, setNoAreas] = useState<string[]>([]);
  const [selectedResponses, setSelectedResponses] = useState<
    Record<string, string>
  >({});
  const [error, setError] = useState<string>("");

  const options = [
    "Misaligned Priorities: The strategy doesn't match our long-term goals and priorities.",
    "Insufficient Funding: There isn't enough sustained funding to support ongoing data collection.",
    "Lack of Incentives: There are not enough incentives for organisations to keep investing in data collection improvements.",
    "Technological Gaps: The strategy doesn't adequately address the need for up-to-date technology and infrastructure.",
    "Knowledge Gaps: Internal capacity is inadequate to sufficiently address requirements."
  ];

  useEffect(
    () => {
      if (responsesQuery) {
        const parsedResponses = JSON.parse(responsesQuery);
        setResponses(parsedResponses);

        // Filter areas with "No" responses
        const areas = Object.keys(parsedResponses).filter(
          area =>
            parsedResponses[area] === "No" ||
            parsedResponses[area] === "Yes" ||
            parsedResponses[area] === "Partially"
        );
        setNoAreas(areas);
      }
    },
    [responsesQuery]
  );

  const handleOptionChange = (area: string, value: string) => {
    setSelectedResponses(prev => ({ ...prev, [area]: value }));

    // Clear error when a valid selection is made
    if (error) {
      setError("");
    }
  };

  const validateResponses = () => {
    // Ensure all areas have a selected response
    return noAreas.every(area => !!selectedResponses[area]);
  };

  const handleNextClick = async () => {
    if (!validateResponses()) {
      setError("Please respond to all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Create a filtered responses object with only the `noAreas`
    const filteredResponses = noAreas.map(area => ({
      area,
      response: selectedResponses[area]
    }));

    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "1c.ii",
      responses: filteredResponses,
      submittedAt: new Date().toISOString() // Add timestamp
    };

    console.log("Filtered Response Payload:", responseObject); // Debugging

    // Send filtered data to your API
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
        // Navigate to the next question
        router.push("/survey/dataCollection/question1d/question1dii");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  if (!responses) return <div>Loading...</div>;

  return (
    <div className="p-6 survey-container">
      <h1 className="mb-4 text-lg font-bold">Data collection</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-lg text-gray-900 font-bold mb-6">
          1.c.ii: Why isn't your organisation's data collection properly
          supported by allocated resources?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question asks why internal funding and support aren't enough
            for your organisation's data collection needs.
          </li>
        </ul>
      </div>

      {/* Table Layout */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Areas</th>
              {options.map((option, index) =>
                <th
                  key={index}
                  className="border border-gray-300 p-2 text-center"
                >
                  {option}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {noAreas.map(area =>
              <tr key={area}>
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                {options.map(option =>
                  <td
                    key={option}
                    className="hover:bg-blue-100 border border-gray-300 text-center"
                  >
                    <input
                      type="radio"
                      name={area}
                      value={option}
                      checked={selectedResponses[area] === option}
                      onChange={() => handleOptionChange(area, option)}
                    />
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {error &&
        <p className="text-red-500 mt-4">
          {error}
        </p>}

      {/* Navigation Buttons */}
      <div className="navigation-buttons mt-6">
        <button
          onClick={handleNextClick}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question1CII />
  </Suspense>;

export default SuspenseWrapper;
