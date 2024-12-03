"use client"; // Ensure the code runs only client-side

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

  // State to track user inputs for the filtered areas
  const [answers, setAnswers] = useState(() =>
    partiallyAreas.reduce((acc, area) => {
      acc[area] = null; // Initialize answers as null
      return acc;
    }, {} as { [key: string]: string | null })
  );

  // Handler to update answers
  const handleSelection = (area: string, value: string) => {
    setAnswers(prev => ({ ...prev, [area]: value }));
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
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Openness and Flow Assessment Organisational Level
          </h1>
          <li>
            This question evaluates the functional effectiveness of internal
            central systems
          </li>
        </ul>
      </div>
      <h1 className="mb-6 text-white">
        3.b.v. How effective are these centralised platforms in facilitating
        data sharing?
      </h1>
      {partiallyAreas.length === 0
        ? <p className="text-white">
            No areas marked as "Partially" or "Yes" in the previous step.
          </p>
        : <form>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "white"
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #444",
                      padding: "10px",
                      background: "black",
                      color: "white"
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
                        background: "black",
                        color: "white",
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
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor = "#444")}
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor = "#333")}
                  >
                    <td
                      style={{
                        border: "1px solid #444",
                        padding: "10px",
                        background: "#222",
                        color: "white"
                      }}
                    >
                      <strong>
                        {area}
                      </strong>
                    </td>
                    {options.map(option =>
                      <td
                        key={option}
                        style={{
                          border: "1px solid #444",
                          padding: "10px",
                          textAlign: "center",
                          background: "#333",
                          color: "white",
                          transition: "background-color 0.3s ease"
                        }}
                        onMouseEnter={e =>
                          (e.currentTarget.style.backgroundColor = "#555")}
                        onMouseLeave={e =>
                          (e.currentTarget.style.backgroundColor = "#333")}
                      >
                        <input
                          type="radio"
                          name={area}
                          value={option}
                          checked={answers[area] === option}
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
            if (Object.values(answers).some(answer => answer === null)) {
              alert("Please complete all selections before proceeding.");
              return;
            }

            // Retrieve user_id from sessionStorage
            const userId_ses = sessionStorage.getItem("user_id");

            if (!userId_ses) {
              alert(
                "User ID is missing. Please return to the basic details page."
              );
              return;
            }

            // Create responseObject only with the selected answers
            const responseObject = {
              userId: userId_ses,
              questionID: "3b.v", // Adding questionID
              responses: Object.entries(answers).map(([area, response]) => ({
                area,
                response
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
                  `/survey/dataOpenessAndFlow/question3c?responses=${encodeURIComponent(
                    JSON.stringify(answers)
                  )}`
                );
              })
              .catch(err => {
                console.error("Error saving responses:", err);
              });
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Question3bv;
