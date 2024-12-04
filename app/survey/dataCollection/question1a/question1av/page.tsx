"use client"; // This is necessary for client-side hooks in Next.js

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Question1aV = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the areas passed from the URL
  const areasFor1av = searchParams.get("areasFor1av");

  const [areas, setAreas] = useState<string[]>([]); // State for areas
  const [responses, setResponses] = useState<Record<string, string>>({}); // Store user responses
  const [error, setError] = useState<string>(""); // Store error message

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  useEffect(
    () => {
      if (areasFor1av) {
        const areasArray = JSON.parse(areasFor1av); // Parse the areasFor1av from query string
        setAreas(areasArray); // Store them in state
      }
    },
    [areasFor1av]
  );

  // Handle the radio button change for each area
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error message when user selects an option
    if (error) {
      setError("");
    }
  };

  // Validation function to check if all areas have been answered
  const validateResponses = () => {
    for (let area of areas) {
      if (!responses[area]) {
        return false; // If any area is unanswered, return false
      }
    }
    return true; // All areas have been answered
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateResponses()) {
      setError("Please answer all areas before submitting.");
      return; // Stop submission if validation fails
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Prepare the response object including area names and their responses
    const responseObject = {
      userId: userId_ses,
      questionID: "1.a.v", // Including the question ID here
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };

    // Log the question ID and responses including area names
    console.log("Question ID and Responses:", responseObject);
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
        // You can use the router to navigate or send data as needed.
        router.push("/survey/dataCollection/question1b");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });

    // For example:
    // router.push("/next-step"); or post the data to an API.
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
          <h1 className="mb-4 text-lg font-bold">Organisational Level</h1>
          <li>
            Check if there is a documented set of rules or guidelines that
            dictate how data should be collected internally
          </li>
        </ul>
      </div>
      <h1>
        1.a.v: Are there internal guidelines that specify how data should be
        collected across the organisation?
      </h1>
      {areas.map((area, index) =>
        <div key={index}>
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

      {/* Error message */}
      {error &&
        <p className="text-red-500">
          {error}
        </p>}

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default Question1aV;
