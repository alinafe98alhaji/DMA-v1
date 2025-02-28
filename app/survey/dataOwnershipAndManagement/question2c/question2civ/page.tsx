"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question2civ = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas from query parameters
  const areasFor2civ: string[] = JSON.parse(
    searchParams.get("areasFor2civ") || "[]"
  );
  const areasFor2cv: string[] = JSON.parse(
    searchParams.get("areasFor2cv") || "[]"
  );

  // Define options for the table
  const wordOptions = [
    "Data protection principles are largely irrelevant and too complex to current operations, with no real impact or necessity observed.",
    "Data protection principles have some relevance, but are not normally feasible to comply with due to low staff awareness/training",
    "Data protection principles are relevant to a broader range of activities, but our systems are old and cant meet current standards",
    "Data protection principles are highly relevant, significantly influencing organisational processes, but require resourcing for implementation",
    "Data protection principles are fully implemented across all aspects of the organisation, fundamentally integral to operations, compliance, and strategic objectives."
  ];

  // State to store responses and validation error
  const [responses, setResponses] = useState<{ [area: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Define score mapping for the options
  const scoreMapping: { [key: string]: number } = {
    [wordOptions[0]]: 0.2,
    [wordOptions[1]]: 0.4,
    [wordOptions[2]]: 0.6,
    [wordOptions[3]]: 0.8,
    [wordOptions[4]]: 1
  };

  // Handle option change
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error message if present
    if (errorMessage) setErrorMessage("");
  };

  // Handle next button click
  const handleNext = async () => {
    // Check if all areas have responses
    const unansweredAreas = areasFor2civ.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setErrorMessage("Please provide a response for all areas.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "2c.iv", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: scoreMapping[response] // Get the score based on the response text
      }))
    };

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
        // Proceed to next question
        // Prepare query parameters for the next step
        const queryParams = new URLSearchParams();
        queryParams.set(
          "areasFor2cv",
          JSON.stringify(areasFor2cv, areasFor2civ)
        );

        // Navigate to 2.c.v
        router.push(
          `/survey/dataOwnershipAndManagement/question2c/question2cv?${queryParams.toString()}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data Ownership and Management</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-lg text-gray-900 font-bold mb-4">
          2.c.iv: How suitable are data protection rules for your organisation?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question examines why/why not your organisation follows the
            established data protection guidelines.
          </li>
        </ul>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Area</th>
            {wordOptions.map((option, index) =>
              <th key={index} className=" border border-gray-300 p-2">
                {option}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areasFor2civ.map(area =>
            <tr key={area}>
              <td className="font-bold border border-gray-300 p-2">
                {area}
              </td>
              {wordOptions.map(option =>
                <td
                  key={option}
                  className="hover:bg-blue-100 border border-gray-300 p-2 text-center"
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
          )}
        </tbody>
      </table>

      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2civ />
  </Suspense>;

export default SuspenseWrapper;
