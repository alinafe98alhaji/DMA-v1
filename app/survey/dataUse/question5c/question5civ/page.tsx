"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

// Mapping options to scores
const optionScores: { [key: string]: number } = {
  "Centralised KPIs are totally ineffective, making it difficult to monitor performance effectively.": 0.2,
  "Basic KPIs are in place but lack standardisation, resulting in inconsistent performance monitoring across the organisation.": 0.4,
  "KPIs are more standardised and centralised, improving performance monitoring, though integration across all departments is incomplete.": 0.6,
  "Well-defined, standardised KPIs are fully established and mostly integrated, providing reliable performance monitoring, with minor gaps in some areas.": 0.8,
  "Fully optimised, standardised, and centralised KPIs comprehensively support performance monitoring, driving continuous improvement across the organisation.": 1
};

const Question5civ = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the "Yes" areas from query params
  const areasFor5civ: string[] = JSON.parse(
    searchParams.get("areasFor5civ") || "[]"
  );

  // State to store user responses for each area
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Define the options for the radio buttons
  const options = [
    "Centralised KPIs are totally ineffective, making it difficult to monitor performance effectively.",
    "Basic KPIs are in place but lack standardisation, resulting in inconsistent performance monitoring across the organisation.",
    "KPIs are more standardised and centralised, improving performance monitoring, though integration across all departments is incomplete.",
    "Well-defined, standardised KPIs are fully established and mostly integrated, providing reliable performance monitoring, with minor gaps in some areas.",
    "Fully optimised, standardised, and centralised KPIs comprehensively support performance monitoring, driving continuous improvement across the organisation."
  ];

  // Handler for selecting an option
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    setError(""); // Clear error once the user selects an option
  };

  // Handle submit button click
  const handleSubmit = () => {
    // Check if all areas have been answered
    const unansweredAreas = areasFor5civ.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if any area is unanswered
      setError("Please provide responses for all areas before submitting.");
      return;
    }

    // Clear error if all areas are answered
    setError("");

    // Prepare the responses to be sent to the backend
    const responseObject = {
      userId: sessionStorage.getItem("user_id"), // Retrieve user_id from sessionStorage
      questionID: "5c.iv", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: optionScores[response] // Add score to each response based on the selected option
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
        router.push("/survey/dataUse/question5d/question5dii");
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
        <h1 className="text-gray-900 text-lg font-bold mb-6">
          5.c.iv: How effective are these KPIs at supporting your organisation
          to monitor its performance?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question evaluates the success of the KPIs in helping your
            organisation track and improve its performance.
          </li>
        </ul>
      </div>

      {/* Tabular Layout for Radio Buttons */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th className="border p-2 text-left w-[200px]">Area</th>
            {options.map(option =>
              <th key={option} className="border p-2 text-center w-[250px]">
                {option}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areasFor5civ.length > 0
            ? areasFor5civ.map(area =>
                <tr key={area}>
                  <td className="font-bold border p-2">
                    {area}
                  </td>
                  {options.map(option =>
                    <td
                      key={option}
                      className="hover:bg-blue-100 border p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={area}
                        value={option}
                        checked={responses[area] === option}
                        onChange={() => handleOptionChange(area, option)}
                      />
                    </td>
                  )}
                </tr>
              )
            : <tr>
                <td
                  colSpan={options.length + 1}
                  className="border p-2 text-center text-gray-600"
                >
                  No areas were marked as "Yes."
                </td>
              </tr>}
        </tbody>
      </table>

      {/* Display error message if there are unanswered areas */}
      {error &&
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>}

      <button
        onClick={handleSubmit}
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
    <Question5civ />
  </Suspense>;

export default SuspenseWrapper;
