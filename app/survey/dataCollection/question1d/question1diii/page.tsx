"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Question1diii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas from the query string
  const areasFor1diii: string[] = JSON.parse(
    searchParams.get("areasFor1diii") || "[]"
  );
  const areasFor1dv: string[] = JSON.parse(
    searchParams.get("areasFor1dv") || "[]"
  );

  // State to store responses and validation error
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>(""); // For validation errors

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle option change
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error if valid input is provided
    if (error) setError("");
  };

  // Handle "Next" button click
  const handleNext = async () => {
    // Validate all areas have a response
    const allAnswered = areasFor1diii.every(area => responses[area]);
    if (!allAnswered) {
      setError("Please select an option for all areas before proceeding.");
      return; // Prevent navigation
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
      questionID: "1d.iii", // Adding questionID
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

        // Filter areas for the next step
        const areasFor1div = areasFor1diii.filter(area =>
          ["Yes", "Partially", "No"].includes(responses[area])
        );

        // Navigate to the next question with areas passed as query parameters
        router.push(
          `/survey/dataCollection/question1d/question1div?areasFor1div=${encodeURIComponent(
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
            This question examines if your organisation utilises the provided
            digital tools for collecting data.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        1.d.iii: Does your organisation use these tools for data collection?
      </h1>
      {areasFor1diii.map((area: string) =>
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
      {error &&
        <p className="text-red-500 mt-4">
          {error}
        </p>}{" "}
      {/* Display error message */}
      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Question1diii;
