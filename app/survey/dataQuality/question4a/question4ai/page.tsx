"use client"; // Ensure the code runs only client-side

import React, { useState, Suspense } from "react";
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

const Question4ai = () => {
  // State to store the text input for each area
  const [responses, setResponses] = useState<{ [key: string]: string }>({
    "Urban Water Supply Coverage": "",
    "Urban Sanitation Sector Coverage": "",
    "Rural Water Supply Sector Coverage": "",
    "Rural Sanitation Sector Coverage": "",
    Finance: "",
    Regulation: "",
    "Utility Operations: Technical, Commercial, Financial, HR": ""
  });

  // State to track validation errors
  const [error, setError] = useState(false);

  // Handler to update the input value for each area
  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (error && value !== "") {
      setError(false); // Clear error when the field is filled
    }
  };

  // Validation function to check if all fields are filled
  const isFormValid = () => {
    return !Object.values(responses).some(response => response === "");
  };

  return (
    <div className="survey-container" style={{ padding: "50px" }}>
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
            Identify the department tasked with assessing data quality. This
            could be a regulatory agency, a national data management authority,
            or a dedicated quality assurance unit within the sector.
          </li>
        </ul>
      </div>
      <h1 style={{ marginBottom: "20px" }}>
        4.a.i Which department is mandated to assess data quality?
      </h1>
      <form style={{ marginBottom: "40px" }}>
        {areas.map(area =>
          <div
            key={area}
            className="mb-4 mt-4 area-section"
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
            <input
              type="text"
              value={responses[area]}
              onChange={e => handleInputChange(area, e.target.value)}
              placeholder={`Enter details for ${area}`}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          </div>
        )}
      </form>

      {/* Error Message */}
      {error &&
        <p style={{ color: "red", marginBottom: "10px" }}>
          Please fill out all fields before proceeding.
        </p>}

      {/* Navigation Button */}
      <div className="navigation-buttons" style={{ marginTop: "20px" }}>
        <Link href="/survey/dataQuality/question4a/question4aii">
          <button
            disabled={!isFormValid()} // Disable button if form is invalid
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              opacity: isFormValid() ? 1 : 0.6 // Adjust opacity when disabled
            }}
            onClick={e => {
              if (!isFormValid()) {
                e.preventDefault(); // Prevent navigation if form is invalid
                setError(true); // Show error message
              }
              // Retrieve user_id from sessionStorage
              const userId_ses = sessionStorage.getItem("user_id");

              if (!userId_ses) {
                alert(
                  "User ID is missing. Please return to the basic details page."
                );
                return;
              }

              // Log responses with questionID
              const responseObject = {
                userId: userId_ses,
                questionID: "4a.i", // Adding questionID
                responses: Object.entries(
                  responses
                ).map(([area, response]) => ({
                  area,
                  response
                }))
              };

              // Send data to your API
              fetch("/api/saveDataQuality", {
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
                  //router.push("/survey/dataQuality/question4a/question4ai");
                })
                .catch(err => {
                  console.error("Error saving responses:", err);
                });
            }}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question4ai />
  </Suspense>;

export default SuspenseWrapper;
