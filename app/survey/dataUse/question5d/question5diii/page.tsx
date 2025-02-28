"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question5diii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas from the query string
  const areasFor1diii: string[] = JSON.parse(
    searchParams.get("areasFor1diii") || "[]"
  );
  const areasFor1dv: string[] = JSON.parse(
    searchParams.get("areasFor1dv") || "[]"
  );

  // State to store responses
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Define the options for the effectiveness question
  const options = [
    "Capacity building/training programmes are totally ineffective, making it difficult to improve data literacy.",
    "Basic programmes are in place but lack regularity or standardisation, resulting in inconsistent data literacy improvements across the organisation.",
    "Programmes are more standardised and regular, improving data literacy, though they may not cover all data areas",
    "Regular, standardised programmes are fully established and well integrated, though there are still gaps in some areas.",
    "Fully optimised, standardised, and centralised programmes comprehensively support data literacy improvements, driving continuous improvement across the organisation in all data areas."
  ];

  // Mapping options to scores
  const optionScores: { [key: string]: number } = {
    "Capacity building/training programmes are totally ineffective, making it difficult to improve data literacy.": 0.2,
    "Basic programmes are in place but lack regularity or standardisation, resulting in inconsistent data literacy improvements across the organisation.": 0.4,
    "Programmes are more standardised and regular, improving data literacy, though they may not cover all data areas": 0.6,
    "Regular, standardised programmes are fully established and well integrated, though there are still gaps in some areas.": 0.8,
    "Fully optimised, standardised, and centralised programmes comprehensively support data literacy improvements, driving continuous improvement across the organisation in all data areas.": 1
  };

  // Handle option change
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    setError(""); // Clear the error when an option is selected
  };

  // Handle "Next" button click
  const handleNext = () => {
    // Check if all areas have been answered
    const unansweredAreas = areasFor1diii.filter(area => !responses[area]);

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
      questionID: "5d.iii", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: optionScores[response] // Send the score based on the selected response
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
        // Filter areas for 1.a.iv based on selected options
        const areasFor1div = areasFor1diii.filter(
          area =>
            responses[area] === options[0] ||
            responses[area] === options[1] ||
            responses[area] === options[2] ||
            responses[area] === options[3] ||
            responses[area] === options[4]
        );

        // Navigate to 1.a.iv and pass areas for both steps
        router.push(
          `/survey/dataUse/question5d/question5div?areasFor1div=${encodeURIComponent(
            JSON.stringify(areasFor1div)
          )}&areasFor1dv=${encodeURIComponent(JSON.stringify(areasFor1dv))}`
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
          5.d.iii: How effective are these capacity building/training programmes
          at improving data literacy in your organisation?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question evaluates the success of the training programmes in
            enhancing data literacy within your organisation.
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
            {options.map((option, index) =>
              <th key={index} className="border p-2">
                {option}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areasFor1diii.map(area =>
            <tr key={area}>
              <td className="font-bold border p-2">
                {area}
              </td>
              {options.map((option, index) =>
                <td
                  key={index}
                  className="hover:bg-blue-100 text-center border p-2"
                >
                  <label>
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
    <Question5diii />
  </Suspense>;

export default SuspenseWrapper;
