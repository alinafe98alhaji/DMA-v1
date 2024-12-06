"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question2ciii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas from the query string
  const areasFor2ciii: string[] = JSON.parse(
    searchParams.get("areasFor2ciii") || "[]"
  );
  const areasFor2cv: string[] = JSON.parse(
    searchParams.get("areasFor2cv") || "[]"
  );

  // State to store responses and error message
  const [responses, setResponses] = useState<Record<string, { response: string; score: number }>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Scoring logic
  const scoreMap: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0,
  };

  // Handle option change
  const handleOptionChange = (area: string, value: string) => {
    const score = scoreMap[value];
    setResponses(prev => ({ ...prev, [area]: { response: value, score } }));

    // Clear error message when a valid response is selected
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Handle "Next" button click
  const handleNext = async () => {
    // Check if all areas have a response
    const unansweredAreas = areasFor2ciii.filter(area => !responses[area]?.response);

    if (unansweredAreas.length > 0) {
      setErrorMessage("Please provide a response for all areas.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Prepare the payload
    const responseObject = {
      userId: userId_ses,
      questionID: "2c.iii", // Adding questionID
      responses: Object.entries(responses).map(([area, { response, score }]) => ({
        area,
        response,
        score,
      })),
    };

    console.log("Filtered Response Payload:", responseObject); // Debugging

    // Send data to your API
    fetch("/api/saveDataOwnershipAndManagement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseObject),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to save responses");
        }
        return res.json();
      })
      .then(data => {
        console.log("Responses saved successfully:", data);

        // Filter areas for 2.c.iv based on responses
        const areasFor2civ = areasFor2ciii.filter(
          area =>
            responses[area].response === "Yes" ||
            responses[area].response === "Partially" ||
            responses[area].response === "No"
        );

        // Navigate to 2.c.iv and pass areas as query parameters
        router.push(
          `/survey/dataOwnershipAndManagement/question2c/question2civ?areasFor2civ=${encodeURIComponent(
            JSON.stringify(areasFor2civ)
          )}&areasFor2cv=${encodeURIComponent(JSON.stringify(areasFor2cv))}`
        );
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
            This question examines if your organisation follows the established
            data protection guidelines.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        2.c.iii: Does your organisation apply rules for data protection and
        security?
      </h1>
      {areasFor2ciii.map((area: string) => (
        <div key={area} className="mb-4">
          <label className="block font-semibold mb-2">{area}</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area]?.response === "Yes"}
                onChange={() => handleOptionChange(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area]?.response === "Partially"}
                onChange={() => handleOptionChange(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area]?.response === "No"}
                onChange={() => handleOptionChange(area, "No")}
              />
              No
            </label>
          </div>
        </div>
      ))}
      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
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
const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Question2ciii />
  </Suspense>
);

export default SuspenseWrapper;
