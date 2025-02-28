"use client"; // Ensure the code runs only client-side

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

const Question3bv = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Use the router hook for navigation
  const responsesQuery = searchParams.get("responses");
  const responses = responsesQuery
    ? JSON.parse(decodeURIComponent(responsesQuery))
    : {};

  // Filter areas where the response was "Yes" or "Partially"
  const partiallyAreas = Object.entries(responses)
    .filter(([_, value]) => value === "Yes" || value === "Partially")
    .map(([area]) => area);

  // Type for the optionScores to explicitly define the keys as strings and values as numbers
  const optionScores: { [key: string]: number } = {
    "Centralised platforms don't connect different data sources well, causing major problems in data sharing.": 0.2,
    "Some integration features exist, but systems often have compatibility issues and support limited data formats, leading to occasional disruptions with frequent downtimes.": 0.4,
    "Systems are improving, with better integration and support for common data formats, but still lack robustness and speed. The user interface is too complex, making it difficult for users to operate efficiently.": 0.6,
    "Systems are well-integrated, supporting many data formats and ensuring reliable data transfer with minimal delays or errors. Staff lack adequate training to use the systems effectively, leading to underutilisation.": 0.8,
    "Centralised systems are top-notch, connecting all data sources seamlessly with high reliability, speed, and no compatibility issues, ensuring optimal data sharing.": 1
  };

  // State to track user inputs for the filtered areas
  const [answers, setAnswers] = useState(() =>
    partiallyAreas.reduce((acc, area) => {
      acc[area] = { response: null, score: null }; // Initialize answers with null values
      return acc;
    }, {} as { [key: string]: { response: string | null, score: number | null } })
  );

  // Handler to update answers with selected response and score
  const handleSelection = (area: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [area]: { response: value, score: optionScores[value] }
    }));
  };

  // Five detailed options for the radio buttons
  const options = [
    "Centralised platforms don't connect different data sources well, causing major problems in data sharing.",
    "Some integration features exist, but systems often have compatibility issues and support limited data formats, leading to occasional disruptions with frequent downtimes.",
    "Systems are improving, with better integration and support for common data formats, but still lack robustness and speed. The user interface is too complex, making it difficult for users to operate efficiently.",
    "Systems are well-integrated, supporting many data formats and ensuring reliable data transfer with minimal delays or errors. Staff lack adequate training to use the systems effectively, leading to underutilisation.",
    "Centralised systems are top-notch, connecting all data sources seamlessly with high reliability, speed, and no compatibility issues, ensuring optimal data sharing."
  ];

  return (
    <div className="survey-container p-6">
      <h1 className="mb-4 text-lg font-bold">
            Data Openness and Flow
          </h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h1 className="mb-4 text-gray-900 font-bold text-lg">
        3.b.v. How effective are these centralised platforms in facilitating
        data sharing?
      </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          
          <li>
            This question evaluates the functional effectiveness of internal
            central systems.
          </li>
        </ul>
      </div>
      
      {partiallyAreas.length === 0
        ? <p className="mb-4">
            No areas marked as "Partially" or "Yes" in the previous step.
          </p>
        : <form>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #444",
                      padding: "10px",
                    }}
                  >
                    Area
                  </th>
                  {options.map((option, index) =>
                    <th
                      key={index}
                      style={{
                        border: "1px solid #444",
                        padding: "10px",
                       
                      
                        textAlign: "center"
                      }}
                    >
                      {option}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {partiallyAreas.map(area =>
                  <tr
                    key={area}
                    style={{
                      
                    }}
                      >
                    <td
                      style={{
                        border: "1px solid #444",
                        padding: "10px",
                        
                      }}
                    >
                      <strong>
                        {area}
                      </strong>
                    </td>
                    {options.map(option =>
                      <td
                      className="hover:bg-blue-100"
                        key={option}
                        style={{
                          border: "1px solid #444",
                          padding: "10px",
                          textAlign: "center",
                          
                        
                        }}
                       >
                        <input
                          type="radio"
                          name={area}
                          value={option}
                          checked={answers[area]?.response === option}
                          onChange={() => handleSelection(area, option)}
                        />
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </form>}

      {/* Navigation Buttons */}
      <div className="navigation-buttons mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          onClick={async () => {
            // Check if all answers are selected before submitting
            if (Object.values(answers).some(answer => answer.response === null)) {
              alert("Please complete all selections before proceeding.");
              return;
            }

            // Retrieve user_id from sessionStorage
            const userId_ses = sessionStorage.getItem("user_id");
            const completionId = sessionStorage.getItem("completionId");

            if (!userId_ses || !completionId) {
              alert(
                "User ID is missing. Please return to the basic details page."
              );
              return;
            }

            // Create responseObject with both response and score
            const responseObject = {
              userId: userId_ses,
              completionId,
              questionID: "3b.v", // Adding questionID
              responses: Object.entries(answers).map(([area, { response, score }]) => ({
                area,
                response,
                score // Include the score here
              }))
            };

            // Send data to your API
            fetch("/api/saveDataOpenessAndFlow", {
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
                router.push(
                  `/survey/dataOpenessAndFlow/question3c/question3cii?responses=${encodeURIComponent(
                    JSON.stringify(answers)
                  )}`
                );
              })
              .catch(err => {
                console.error("Error saving responses:", err);
              });
          }}
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
    <Question3bv />
  </Suspense>
);

export default SuspenseWrapper;