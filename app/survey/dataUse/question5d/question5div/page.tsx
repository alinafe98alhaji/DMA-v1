"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

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

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "5d.iv", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    // Send data to your API
    fetch("/api/saveDataUse", {
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
        // Redirect to 5.d.v with areas answered "No"
        const queryParams = new URLSearchParams();
        queryParams.set("areasFor1dv", JSON.stringify(areasFor5dv));

        // Navigate to 5.d.v
        router.push(
          `/survey/dataUse/question5d/question5dv?${queryParams.toString()}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data Use</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 text-lg font-bold mb-4">
          5.d.iv: How could these capacity building/training programmes be more
          effective at improving data literacy in your organisation?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question seeks suggestions for improving the effectiveness of
            the training programmes in boosting data literacy.
          </li>
        </ul>
      </div>

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
              <td className="font-bold border p-2">
                {area}
              </td>
              {options.map((option: string, index: number) =>
                <td
                  key={index}
                  className="hover:bg-blue-100 border p-2 text-center align-middle"
                >
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

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question5div />
  </Suspense>;

export default SuspenseWrapper;
