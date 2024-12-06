"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question5ciii = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse areas marked as Partially/No from 5.c.ii
  const areasFor5ciii: string[] = JSON.parse(
    searchParams.get("areasFor5ciii") || "[]"
  );
  const areasFor5civ: string[] = JSON.parse(
    searchParams.get("areasFor5civ") || "[]"
  );

  // State to store responses for each area and error message
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Handle radio button selection change
  const handleSelectionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error message if the user selects an option
    setError("");
  };

  // Handle next button click
  const handleNext = () => {
    // Check if all areas have been answered
    const unansweredAreas = areasFor5ciii.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if any area is unanswered
      setError("Please provide reasons for all areas before proceeding.");
      return;
    }

    // Clear error if all areas are answered
    setError("");

    console.log("Responses for 5.c.iii:", responses);

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "5c.iii", // Adding questionID
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
        // Navigate to the next page (if needed)
        router.push(
          `/survey/dataUse/question5c/question5civ?areasFor5civ=${encodeURIComponent(
            JSON.stringify(areasFor5civ)
          )}`
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
            Data Use Assessment Organisational Level
          </h1>
          <li>
            This question seeks reasons why your organisation might not be using
            the established KPIs.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        5.c.iii: Why does your organisation not use these KPIs for performance
        monitoring?
      </h1>

      {/* Tabular Layout for Radio Buttons */}
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="border p-2 text-center">Area</th>
            <th className="border p-2 text-left">
              Lack of Relevance: KPIs do not match the specific performance
              metrics relevant to the organisation.
            </th>
            <th className="border p-2 text-center">
              Rigid Structure: KPIs are too rigid, offering no flexibility to
              adapt to organisational changes.
            </th>
            <th className="border p-2 text-center">
              Cultural Dissonance: The organisation's culture does not support
              reliance on standardised external metrics.
            </th>
            <th className="border p-2 text-center">
              Implementation Challenges: Challenges in implementing and
              consistently using these KPIs across the organisation.
            </th>

            <th className="border p-2 text-center">
              Very Inadequate training: Staff do not have the know-how to
              interpret the KPIs for performance analysis
            </th>
          </tr>
        </thead>
        <tbody>
          {areasFor5ciii.map(area =>
            <tr key={area}>
              <td className="border p-2">
                {area}
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={area}
                  value="0.2"
                  checked={
                    responses[area] ===
                    "Lack of Relevance: KPIs do not match the specific performance metrics relevant to the organisation."
                  }
                  onChange={() =>
                    handleSelectionChange(
                      area,
                      "Lack of Relevance: KPIs do not match the specific performance metrics relevant to the organisation."
                    )}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={area}
                  value="0.4"
                  checked={
                    responses[area] ===
                    "Rigid Structure: KPIs are too rigid, offering no flexibility to adapt to organisational changes."
                  }
                  onChange={() =>
                    handleSelectionChange(
                      area,
                      "Rigid Structure: KPIs are too rigid, offering no flexibility to adapt to organisational changes."
                    )}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={area}
                  value="0.6"
                  checked={
                    responses[area] ===
                    "Cultural Dissonance: The organisation's culture does not support reliance on standardised external metrics."
                  }
                  onChange={() =>
                    handleSelectionChange(
                      area,
                      "Cultural Dissonance: The organisation's culture does not support reliance on standardised external metrics."
                    )}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={area}
                  value="0.8"
                  checked={
                    responses[area] ===
                    "Implementation Challenges: Challenges in implementing and consistently using these KPIs across the organisation."
                  }
                  onChange={() =>
                    handleSelectionChange(
                      area,
                      "Implementation Challenges: Challenges in implementing and consistently using these KPIs across the organisation."
                    )}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={area}
                  value="1.0"
                  checked={
                    responses[area] ===
                    "Very Inadequate training: Staff do not have the know-how to interpret the KPIs for performance analysis"
                  }
                  onChange={() =>
                    handleSelectionChange(
                      area,
                      "Very Inadequate training: Staff do not have the know-how to interpret the KPIs for performance analysis"
                    )}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Display error message if there are unanswered areas */}
      {error &&
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>}

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
    <Question5ciii />
  </Suspense>;

export default SuspenseWrapper;
