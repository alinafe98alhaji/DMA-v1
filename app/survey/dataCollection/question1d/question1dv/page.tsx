"use client"; // This is necessary for client-side hooks in Next.js

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Question1dV = () => {
  const searchParams = useSearchParams();
  const areasFor1dv = searchParams.get("areasFor1dv"); // Get the areas passed from the URL

  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter(); // Hook to handle routing

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  useEffect(
    () => {
      if (areasFor1dv) {
        const areasArray = JSON.parse(areasFor1dv); // Parse the areasFor1dv from query string
        setAreas(areasArray); // Store them in state
      }
    },
    [areasFor1dv]
  );

  // Handle option change for each area
  const handleOptionChange = (area: string, value: string) => {
    // Remove error message when user starts selecting an option
    if (!responses[area]) {
      setErrorMessage(""); // Clear the error message if the user starts selecting
    }

    setResponses(prev => ({ ...prev, [area]: value }));
  };

  // Validation for the Next button
  const handleNext = async () => {
    // Ensure all areas have been answered
    const allAnswered = areas.every(area => responses[area]);
    if (!allAnswered) {
      setErrorMessage("Please select an option for every area.");
      return;
    }

    // If all are answered, clear any previous error message and proceed
    setErrorMessage("");

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "1d.v", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };

    // Send data to your API
    fetch("/api/saveResponses", {
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
        // Navigate to the next page
        router.push("/survey/dataOwnershipAndManagement/question2a");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  // If no areas are selected, return a message
  if (areas.length === 0) {
    return <div>No areas to display.</div>;
  }

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Collection Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation has internal digital
            tools for data collection
          </li>
        </ul>
      </div>

      <h1>
        1.d.v: Does your organisation have internal standardised digital tools
        for data collection?
      </h1>

      {areas.map((area, index) =>
        <div className="mb-4 mt-4" key={index}>
          <label>
            {area}
          </label>
          <div>
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

      {/* Error Message */}
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      {/* Next Button */}
      <div className="navigation-buttons mt-4">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question1dV;
