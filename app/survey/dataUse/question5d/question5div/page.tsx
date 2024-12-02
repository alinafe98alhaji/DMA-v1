"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Question5div = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 5.d.iii (for this page)
  const areasFor5div: string[] = JSON.parse(
    searchParams.get("areasFor1div") || "[]"
  );

  // Parse areas that were answered "No" from 5.d.ii (for 5.d.v)
  const areasFor5dv: string[] = JSON.parse(
    searchParams.get("areasFor1dv") || "[]"
  );

  // State to store responses
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Define the options for the effectiveness question
  const options = [
    "Improve Relevance: Programmes should address the specific data literacy needs of the organisation.",
    "Increase scope of staff to be trained: Include staff from different departments and levels.",
    "Hybrid trainings: Consider both in-person and virtual trainings as suitable.",
    "Resource allocation: Organisation should afford the cost of training programmes.",
    "Training Schedule: Outline a training schedule that allows the organisation to plan attendance."
  ];

  // Handle option change
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    setError(""); // Clear the error when an option is selected
  };

  // Handle "Next" button click
  const handleNext = () => {
    // Check if all areas have been answered
    const unansweredAreas = areasFor5div.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      setError("Please provide a response for all areas before proceeding.");
      return;
    }

    setError(""); // Clear error if all areas are answered

    // Redirect to 5.d.v with areas answered "No"
    const queryParams = new URLSearchParams();
    queryParams.set("areasFor1dv", JSON.stringify(areasFor5dv));

    // Navigate to 5.d.v
    router.push(
      `/survey/dataUse/question5d/question5dv?${queryParams.toString()}`
    );
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
            Data Use Assessment Organisational Level
          </h1>
          <li>
            This question seeks suggestions for improving the effectiveness of
            the training programmes in boosting data literacy.
          </li>
        </ul>
      </div>

      <h1 className="text-xl font-bold mb-6">
        5.d.iv: How could these capacity building/training programmes be more
        effective at improving data literacy in your organisation?
      </h1>

      {/* Display error message if there are unanswered areas */}
      {error &&
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>}

      {/* Table Layout for Questions */}
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Area</th>
            {options.map((option: string, index: number) =>
              <th key={index} className="border p-2">
                {option}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areasFor5div.map((area: string) =>
            <tr key={area}>
              <td className="border p-2">
                {area}
              </td>
              {options.map((option: string, index: number) =>
                <td key={index} className="border p-2 text-center align-middle">
                  <label className="flex justify-center items-center h-full">
                    <input
                      type="radio"
                      name={area}
                      value={option}
                      checked={responses[area] === option}
                      onChange={() => handleOptionChange(area, option)}
                    />
                  </label>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Question5div;
