"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Question2d = () => {
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
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle option change (update responses state)
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (errorMessage) setErrorMessage(""); // Clear error message on selection
  };

  // Handle "Next" button click
  const handleNext = async () => {
    // Check if all areas have been answered
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setErrorMessage("Please answer all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "2d", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
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
        // Separate areas into two groups
        const areasFor2di = areas.filter(
          area => responses[area] === "Yes" || responses[area] === "Partially"
        );
        const areasFor2dii = areas.filter(area => responses[area] === "No");

        // Pass data to the next step using URL query parameters
        router.push(
          `/survey/dataOwnershipAndManagement/question2d/question2di?areasFor2di=${encodeURIComponent(
            JSON.stringify(areasFor2di)
          )}&areasFor2dii=${encodeURIComponent(JSON.stringify(areasFor2dii))}`
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
            This question examines why/why not your organisation has put in
            place mechanisms to prevent/respond to cybersecurity threats.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        2.d: Are there common rules and methods that govern data storage and
        backup in the organisation?
      </h1>

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

      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Next
      </button>
    </div>
  );
};

export default Question2d;
