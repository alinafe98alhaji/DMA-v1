"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Question5dii = () => {
  const router = useRouter();

  // Define the areas of interest
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  // State to store responses
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Handle option change (update responses state)
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    // Clear the error when user selects an option
    setError("");
  };

  // Handle "Next" button click
  const handleNext = () => {
    // Check if all areas have been answered
    const unansweredAreas = areas.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if there are unanswered areas
      setError("Please provide a response for all areas before proceeding.");
      return;
    }

    // Clear error if all areas are answered
    setError("");

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "5d.ii", // Adding questionID
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
        // Separate areas into two groups
        const areasFor1diii = areas.filter(
          area => responses[area] === "Yes" || responses[area] === "Partially"
        );
        const areasFor1dv = areas.filter(area => responses[area] === "No");

        // Pass data to 1.a.iii using URL query parameters
        router.push(
          `/survey/dataUse/question5d/question5diii?areasFor1diii=${encodeURIComponent(
            JSON.stringify(areasFor1diii)
          )}&areasFor1dv=${encodeURIComponent(JSON.stringify(areasFor1dv))}`
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
            This question examines if your organisation takes part in these
            training and capacity building initiatives.
          </li>
        </ul>
      </div>

      <h1 className="text-xl font-bold mb-6">
        5.d.ii: Does your organisation participate in these capacity
        building/training programmes?
      </h1>

      {/* Display error message if there are unanswered areas */}
      {error &&
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>}

      {areas.map(area =>
        <div key={area} className="mb-4">
          <label className="block font-semibold mb-2">
            {area}
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleOptionChange(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleOptionChange(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleOptionChange(area, "No")}
              />
              No
            </label>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Question5dii;
