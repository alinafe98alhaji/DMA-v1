"use client"; // Ensure the code runs only client-side

import { useRouter } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
export const dynamic = "force-dynamic";

// Define areas and options
const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

const options = [
  "External incentives are ineffective, offering inadequate value, with no observable impact on promoting data-driven decision-making.",
  "Some incentives exist, but not well aligned to organisational goals and their impact is limited and sporadic, leading to occasional data-driven decisions. Lack of awareness about available incentives among relevant staff.",
  "Incentives are better structured and more frequent, starting to influence decision-making more consistently, though not systematically across all areas.",
  "Strong and well-implemented incentives are in place, promoting data-driven decision-making in many parts of the organisation, with some areas still to improve.",
  "Comprehensive and highly effective incentives are established, consistently and successfully encouraging data-driven decision-making throughout the organisation."
];

// Mapping options to scores
const optionScores: { [key: string]: number } = {
  "External incentives are ineffective, offering inadequate value, with no observable impact on promoting data-driven decision-making.": 0.2,
  "Some incentives exist, but not well aligned to organisational goals and their impact is limited and sporadic, leading to occasional data-driven decisions. Lack of awareness about available incentives among relevant staff.": 0.4,
  "Incentives are better structured and more frequent, starting to influence decision-making more consistently, though not systematically across all areas.": 0.6,
  "Strong and well-implemented incentives are in place, promoting data-driven decision-making in many parts of the organisation, with some areas still to improve.": 0.8,
  "Comprehensive and highly effective incentives are established, consistently and successfully encouraging data-driven decision-making throughout the organisation.": 1
};

const Question5bi = () => {
  const router = useRouter();
  const [responses, setResponses] = useState<{ [key: string]: { response: string; score: number } | null }>(
    Object.fromEntries(areas.map(area => [area, null]))
  );

  // Handle selection of the option
  const handleSelection = (area: string, option: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: { response: option, score: optionScores[option] }
    }));
  };

  // Handle submission of the responses
  const handleNext = async () => {
    console.log("Final answers submitted:", responses);

    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "5b.i",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response: response?.response || null,
        score: response?.score || null
      }))
    };

    try {
      const res = await fetch("/api/saveDataUse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) throw new Error("Failed to save responses");

      const data = await res.json();
      console.log("Responses saved successfully:", data);
      router.push("/survey/dataUse/question5b/question5bii"); // Navigate to the next page
    } catch (err) {
      console.error("Error saving responses:", err);
    }
  };

  useEffect(() => {
    const userId_ses = sessionStorage.getItem("user_id");
    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
    }
  }, []);

  return (
    <div className="survey-container p-6">
      <h1 className="mb-4 text-lg font-bold">
            Data Use
          </h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
         <h1 className="text-gray-900 mb-4 text-lg font-bold">
        5.b.i How effective are incentives to promote data-driven decision
        making?
      </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          
          <li>
            This question evaluates the success of the incentives in encouraging
            your organisation to make decisions based on data.
          </li>
        </ul>
      </div>
     

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b bg-black-100 text-center">Area</th>
            {options.map((option, index) => (
              <th
                key={index}
                className="px-4 py-2 border-b bg-black-100 text-center"
              >
                <strong>{option}</strong>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas.map(area => (
            <tr key={area}>
              <td className="font-bold px-4 py-2 border-b text-left">{area}</td>
              {options.map((option, index) => (
                <td key={index} className="px-4 py-2 border-b text-center">
                  <input
                    type="radio"
                    name={area}
                    value={option}
                    checked={responses[area]?.response === option}
                    onChange={() => handleSelection(area, option)}
                    className="hover:bg-blue-100 rounded-md"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="navigation-buttons mt-4">
        <button
          disabled={Object.values(responses).some(
            response => response === null
          )}
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
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
    <Question5bi />
  </Suspense>
);

export default SuspenseWrapper;
