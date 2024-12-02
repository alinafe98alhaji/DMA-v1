"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Question3aiv = () => {
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
          area => parsedResponses[area] === "No"
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

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "3a.iv", // Adding questionID
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
        // Proceed to Question 3b
        router.push("/survey/dataOpenessAndFlow/question3b");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  if (!responses) return <div>Loading...</div>;

  return (
    <div className="p-6 survey-container">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Openess and Flow Assessment Organisational Level
          </h1>
          <li>
            This question asks whether your organisation has rules that help
            different systems share and use data easily and govern data sharing
            processes
          </li>
        </ul>
      </div>

      <h1 className="text-xl font-bold mb-6">
        3.a.iv: Are there established rules and regular processes for data
        sharing across different systems in your organisation (interoperability
        support)?
      </h1>

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
              <tr key={area} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                {options.map(option =>
                  <td
                    key={option}
                    className="border border-gray-300 text-center"
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

export default Question3aiv;
