"use client"; // Ensure the code runs only client-side

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
export const dynamic = "force-dynamic";

const Question5ai = () => {
  const searchParams = useSearchParams();
  const responsesQuery = searchParams.get("responses");
  const responses = responsesQuery
    ? JSON.parse(decodeURIComponent(responsesQuery))
    : {};

  // State to store user inputs for the selected areas
  const [answers, setAnswers] = useState<{ [key: string]: { text: string, score: number } }>({});
  const [isMounted, setIsMounted] = useState(false); // State to track mounting (for client-side check)

  // UseEffect to set isMounted to true after mounting
  useEffect(() => {
    setIsMounted(true); // Set to true after the component is mounted
  }, []);

  // Define the options
  const options = [
    "Centrally managed platforms are rudimentary, offering little to no support for decision-making.",
    "Platforms exist but are limited in functionality, providing basic data insights that infrequently influence decisions.",
    "Improvements in platform functionality are evident, offering more relevant data insights that occasionally aid decision-making.",
    "Robust platforms provide comprehensive analytics and visualisations, regularly contributing to informed decision-making, though minor gaps in data relevance or timeliness may persist.",
    "State-of-the-art platforms deliver timely, accurate, and actionable insights that consistently drive strategic decisions across the organisation."
  ];

  // Define the corresponding scores for each option
const scoreMapping: { [key: number]: number } = {
  0: 0.2,
  1: 0.4,
  2: 0.6,
  3: 0.8,
  4: 1
};


  if (!isMounted) {
    return null; // Prevent rendering before the component is mounted
  }

  // Handler to update answers (now stores both text and score)
  const handleInputChange = (area: string, index: number) => {
    const selectedText = options[index];
    const selectedScore = scoreMapping[index];

    setAnswers(prev => ({
      ...prev,
      [area]: { text: selectedText, score: selectedScore }
    }));
  };

  // Check if all answers have been selected
  const isFormComplete = Object.keys(responses).every(area => answers[area]);

  // Function to handle form submission
  const handleSubmit = async () => {
    // Filter out areas where the user has not selected a response
    const selectedAnswers = Object.entries(answers)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([area, value]) => ({
        area,
        response: {
          text: value.text,
          score: value.score
        }
      }));

    if (selectedAnswers.length === 0) {
      alert("Please select at least one answer before submitting.");
      return;
    }

    // Send selected answers to the database
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "5a.i", // Adding questionID
      responses: selectedAnswers
    };

    // Send data to your API
    try {
      const res = await fetch("/api/saveDataUse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) {
        throw new Error("Failed to save responses");
      }
      const data = await res.json();
      console.log("Responses saved successfully:", data);
    } catch (err) {
      console.error("Error saving responses:", err);
    }
  };

  return (
    <div className="survey-container" style={{ padding: "20px" }}>
      <h1 className="mb-4 text-lg font-bold">
            Data Use
          </h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 text-lg font-bold" style={{ marginBottom: "20px" }}>
        5.a.i How useful are these platforms for informing decision making?
      </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          
          <li>
            This question evaluates the practicality and usefulness of the
            platforms in helping your organisation make informed decisions.
          </li>
        </ul>
      </div>
      
      <form style={{ marginBottom: "40px" }}>
        {/* Table Layout */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Area
              </th>
              {options.map((option, index) =>
                <th
                  key={index}
                  style={{ padding: "10px", border: "1px solid #ccc" }}
                >
                  {option}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.keys(responses).map(area =>
              <tr key={area}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    fontWeight: "bold"
                  }}
                >
                  {area}
                </td>
                {options.map((option, index) =>
                  <td
                  className="text-center hover:bg-blue-100"
                    key={index}
                    style={{ padding: "10px", border: "1px solid #ccc" }}
                  >
                    <label>
                      <input
                        type="radio"
                        name={area}
                        value={scoreMapping[index]} // Store the score
                        checked={answers[area]?.score === scoreMapping[index]}
                        onChange={() => handleInputChange(area, index)}
                      />
                    </label>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </form>

      {/* Navigation Button using Link */}
      <div className="navigation-buttons" style={{ marginTop: "20px" }}>
        {/* Only show the button if all answers are selected */}
        <Link
          href="/survey/dataUse/question5b"
          passHref
          style={{
            backgroundColor: isFormComplete ? "#007BFF" : "#d6e0f0", // Change color if form is not complete
            color: isFormComplete ? "white" : "#aaa", // Change text color if form is not complete
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: isFormComplete ? "pointer" : "not-allowed", // Disable pointer if form is not complete
            textDecoration: "none", // Remove underline from link
            display: "inline-block",
            opacity: isFormComplete ? 1 : 0.5 // Make it less visible if form is not complete
          }}
          onClick={handleSubmit}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Question5ai />
  </Suspense>
);

export default SuspenseWrapper;
