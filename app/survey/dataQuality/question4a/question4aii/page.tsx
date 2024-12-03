"use client"; // Ensure the code runs only client-side

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

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
  "Centralised data quality processes are ineffective, with limited scope leading to poor data quality.",
  "Basic processes are established but lack thoroughness and consistency, resulting in only slight improvements in data quality.",
  "Processes are improving, becoming more regular and systematic, but still face challenges in full implementation and coverage due to complexity",
  "Strong, well-integrated processes are in place, significantly improving data quality, though minor gaps in coverage or timeliness may exist due to resource availability",
  "Fully optimised and comprehensive centralised processes ensure top-quality data consistently, with no significant gaps."
];

const Question4aii = () => {
  const router = useRouter(); // Initialize useRouter for client-side navigation
  const [responses, setResponses] = useState<{ [key: string]: number | null }>(
    Object.fromEntries(areas.map(area => [area, null]))
  );

  const handleSelection = (area: string, value: number) => {
    setResponses(prev => ({ ...prev, [area]: value }));
  };

  const handleNext = async () => {
    console.log("Final answers submitted:", responses);

    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    const responseObject = {
      userId: userId_ses,
      questionID: "4a.ii",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    try {
      const res = await fetch("/api/saveDataQuality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) throw new Error("Failed to save responses");

      const data = await res.json();
      console.log("Responses saved successfully:", data);
      router.push("/survey/dataQuality/question4b"); // Navigate to the next page
    } catch (err) {
      console.error("Error saving responses:", err);
    }
  };

  useEffect(() => {
    const userId_ses = sessionStorage.getItem("user_id");
    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
    }
  }, []); // Ensures alert is shown on first render if user ID is missing

  return (
    <div className="survey-container p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Quality Assessment Organisational Level
          </h1>
          <li>
            This question evaluates the success of the centralised data quality
            assessments in improving your data quality.
          </li>
        </ul>
      </div>
      <h1 className="mb-4 text-xl font-bold">
        4.a.ii How effective is the centralised process for ongoing assessment
        of data quality at improving/ ensuring the quality of data for your
        organisation?
      </h1>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b bg-black-100 text-center">
              Area
            </th>
            {options.map((option, index) =>
              <th
                key={index}
                className="px-4 py-2 border-b bg-black-100 text-center"
              >
                <strong>
                  {option}
                </strong>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areas.map(area =>
            <tr key={area}>
              <td className="px-4 py-2 border-b text-left">
                {area}
              </td>
              {options.map((_, index) =>
                <td key={index} className="px-4 py-2 border-b text-center">
                  <input
                    type="radio"
                    name={area}
                    value={index + 1}
                    checked={responses[area] === index + 1}
                    onChange={() => handleSelection(area, index + 1)}
                    className="hover:bg-blue-100 rounded-md"
                  />
                </td>
              )}
            </tr>
          )}
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

export default Question4aii;
