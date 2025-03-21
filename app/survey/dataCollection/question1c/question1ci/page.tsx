"use client";

import React, { Suspense,useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import Link from "next/link";

const Question1CI = () => {
  const searchParams = useSearchParams();
  const responsesQuery = searchParams.get("responses");

  const [responses, setResponses] = useState<any>(null);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
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
  }, [responsesQuery]);

  // Define response options with scores
  const options = [
    {
      text: "The existing resourcing is completely inadequate, and cannot support basic sustainability needs.",
      score: 0.2
    },
    {
      text: "The allocated resources address some short-term needs but lack future-focused sustainability.",
      score: 0.4
    },
    {
      text: "The available resources partially address sustainability but is not fully comprehensive",
      score: 0.6
    },
    {
      text: "A comprehensive budget is in place but not fully optimised, with some sustainability gaps remaining.",
      score: 0.8
    },
    {
      text: "Comprehensive resources are allocated and implemented that ensure long-term sustainability of data collection.",
      score: 1.0
    }
  ];

  // Handle Next button click with validation
  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Ensure all filtered areas are answered
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

    setError(""); // Clear error if validation passes

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Build response object with scores for filtered areas
    const filteredResponses = filteredAreas.map(area => {
      const selectedOption = options.find(
        option => option.text === responses[area]
      );
      return {
        area,
        response: responses[area],
        score: selectedOption?.score || 0 // Assign score or default to 0
      };
    });

    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "1c.i",
      responses: filteredResponses,
      submittedAt: new Date().toISOString() // Add a submission timestamp
    };

    console.log("Filtered Response Payload with Scores:", responseObject); // Debugging

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

        // Proceed to the next page
        const nextPageLink = `/survey/dataCollection/question1c/question1cii?responses=${encodeURIComponent(
          JSON.stringify(responses)
        )}`;
        window.location.href = nextPageLink;
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
      <h1 className="mb-4 text-lg font-bold">
            Data collection
          </h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="font-bold mb-4 text-gray-900 text-lg">
        1.c.i. How well have the resources ensured the sustainability of your
        organisation's data collection processes?
      </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          
          <li>
            This question asks how effective the resourcing strategy is for your
            organisation.
          </li>
        </ul>
      </div>

      

      {/* Table layout */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Areas</th>
              {options.map(option => (
                <th
                  key={option.text}
                  className="border border-gray-300 p-2 text-center"
                >
                  {option.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAreas.map(area => (
              <tr key={area} >
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                {options.map(option => (
                  <td
                    key={option.text}
                    className="hover:bg-blue-100 border border-gray-300 text-center"
                  >
                    <input
                      type="radio"
                      name={area}
                      value={option.text}
                      checked={responses[area] === option.text}
                      onChange={() => handleRadioChange(area, option.text)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error message display */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Next Button */}
      <div className="navigation-buttons mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Question1CI />
  </Suspense>
);

export default SuspenseWrapper;
