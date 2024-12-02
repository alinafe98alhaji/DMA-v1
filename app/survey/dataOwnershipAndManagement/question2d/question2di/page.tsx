"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Question2di = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 1.a.iii (for this page)
  const areasFor2di = JSON.parse(searchParams.get("areasFor2di") || "[]");

  // Parse areas that were answered "No" from 1.a.ii (for 1.a.v)
  const areasFor2dii = JSON.parse(searchParams.get("areasFor2dii") || "[]");

  // Define word options for the radio buttons (Yes, Partially, No)
  const wordOptions = ["Yes", "Partially", "No"];

  // State to store responses for each area
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle option change for each area
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (errorMessage) setErrorMessage(""); // Clear error message on selection
  };

  // Handle next button click
  const handleNext = async () => {
    // Check if all areas have been answered
    const unansweredAreas = areasFor2di.filter(
      (area: string | number) => !responses[area]
    );
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
      questionID: "2d.i", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
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

        // Redirect to the next page with the areas answered "No" in 1.a.ii
        const queryParams = new URLSearchParams();
        queryParams.set("areasFor2dii", JSON.stringify(areasFor2dii));

        // Redirect to the next page
        router.push(
          `/survey/dataOwnershipAndManagement/question2d/question2dii?${queryParams.toString()}`
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
            guidelines for storing and backing up data consistently.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        2.d.i: Does your organisation comply with these rules for data storage
        and backup?
      </h1>

      {/* Loop through each area and render the options */}
      {areasFor2di.map((area: string) =>
        <div key={area} className="mb-4">
          <label className="block font-semibold mb-2">
            {area}
          </label>

          <div className="flex gap-4">
            {wordOptions.map(option =>
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={area}
                  value={option}
                  checked={responses[area] === option}
                  onChange={() => handleOptionChange(area, option)}
                  className="mr-2"
                />
                {option}
              </label>
            )}
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

export default Question2di;
