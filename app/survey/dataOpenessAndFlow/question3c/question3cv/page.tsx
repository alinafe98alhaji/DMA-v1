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
  "Open data is not a priority, resulting in negligible external engagement.",
  "Policies exist but lack consistency, leading to limited engagement.",
  "Clearer, more consistent policies increase engagement, though some accessibility issues remain.",
  "Well-established policies enhance accessibility, achieving high engagement with occasional support gaps.",
  "Optimized policies maximize accessibility and engagement, continuously supported by updates and community interaction."
];

const Question3cv = () => {
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
      questionID: "3c.v",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    try {
      const res = await fetch("/api/saveDataOpenessAndFlow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) throw new Error("Failed to save responses");

      const data = await res.json();
      console.log("Responses saved successfully:", data);
      router.push("/survey/dataQuality/question4a"); // Navigate to the next page
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
      <h1 className="mb-4 text-xl font-bold">
        3.c.v How effective are open data policies in promoting increased
        external user engagement with your data?
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

export default Question3cv;
