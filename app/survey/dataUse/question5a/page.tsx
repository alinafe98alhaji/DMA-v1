"use client"; // Ensure the code runs only client-side

import React, { useState } from "react";
import Link from "next/link"; // To enable navigation to the next page
export const dynamic = "force-dynamic";

const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

const Question5a = () => {
  // State to store the responses for Yes/No/Partially
  const [responses, setResponses] = useState<{
    [key: string]: "Yes" | "Partially" | "No" | null;
  }>({
    "Urban Water Supply Coverage": null,
    "Urban Sanitation Sector Coverage": null,
    "Rural Water Supply Sector Coverage": null,
    "Rural Sanitation Sector Coverage": null,
    Finance: null,
    Regulation: null,
    "Utility Operations: Technical, Commercial, Financial, HR": null
  });

  const [error, setError] = useState(false); // To track validation errors
  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handler to update responses
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear the error message if the user starts selecting
    setError(false);
  };

  const handleSubmit = () => {
    // Check if all responses are filled
    const isValid = Object.values(responses).every(value => value !== null);

    if (!isValid) {
      setError(true); // Trigger error message if any field is empty
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
      questionID: "5a", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: response ? responseScores[response] : 0 // Include the score
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

        // Navigate to the next page if valid
        //router.push("/survey/dataUse/question5a");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });

    // Proceed to the next page
  };

  return (
    <div className="survey-container" style={{ padding: "20px" }}>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Quality Assessment National Level
          </h1>
          <li>
            Check if there are established platforms or software tools that
            facilitate data analysis and visualization.
          </li>
          <li>
            Look for features that allow users to create reports, dashboards,
            and visual data presentations that help in understanding and using
            the data effectively.
          </li>
        </ul>
      </div>
      <h1 style={{ marginBottom: "20px" }}>
        5.a. Are there internal centralised systems/ platforms for data
        analysis, visualisation and reporting?
      </h1>
      <form style={{ marginBottom: "40px" }}>
        {areas.map(area =>
          <div
            key={area}
            className="area-section"
            style={{ marginBottom: "15px" }}
          >
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px"
              }}
            >
              {area}
            </label>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Yes"
                  checked={responses[area] === "Yes"}
                  onChange={() => handleSelection(area, "Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Partially"
                  checked={responses[area] === "Partially"}
                  onChange={() => handleSelection(area, "Partially")}
                />
                Partially
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="No"
                  checked={responses[area] === "No"}
                  onChange={() => handleSelection(area, "No")}
                />
                No
              </label>
            </div>
          </div>
        )}
      </form>

      {/* Validation Error Message */}
      {error &&
        <p style={{ color: "red", marginTop: "10px" }}>
          Please answer all questions before proceeding.
        </p>}

      {/* Navigation Button */}
      <div className="navigation-buttons" style={{ marginTop: "20px" }}>
        <Link
          href={{
            pathname: "/survey/dataUse/question5a/question5ai",
            query: {
              responses: JSON.stringify(
                Object.fromEntries(
                  Object.entries(responses).filter(
                    ([_, value]) => value !== "No"
                  ) // Filter out areas with "No"
                )
              )
            }
          }}
        >
          <button
            disabled={Object.values(responses).some(
              response => response === null
            )} // Disable if any field is empty
            onClick={handleSubmit}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Question5a;
