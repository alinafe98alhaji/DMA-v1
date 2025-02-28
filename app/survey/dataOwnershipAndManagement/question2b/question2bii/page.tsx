"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
export const dynamic = "force-dynamic";

const Question2bii = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Parse the areas query parameter
  useEffect(
    () => {
      if (areasParam) {
        try {
          // Decode the areas and parse it into an array
          const decodedAreas = JSON.parse(decodeURIComponent(areasParam));
          setAreas(decodedAreas);
        } catch (error) {
          console.error("Error parsing areas:", error);
        }
      }
    },
    [areasParam]
  );

  const handleRadioChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    if (value !== "") {
      setErrorMessage(""); // Clear error message when user selects an option
    }
  };

  const handleSubmit = async () => {
    // Check if all areas have been answered
    for (const area of areas) {
      if (!responses[area] || responses[area].trim() === "") {
        setErrorMessage("Please provide a response for all areas.");
        return;
      }
    }

    console.log("Follow-up responses:", responses);

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "2b.ii", // Adding questionID
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
        // Navigate to the next page after 2.b.ii (you can define the next page here)
        router.push(
          `/survey/dataOwnershipAndManagement/question2c/question2cii`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data Ownership and Management</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="font-bold text-gray-900 text-lg mb-4">
          2.b.ii Does your organisation participate in national consultation
          processes and forums where stakeholders in the sector can discuss
          their data usage and requirements?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question checks if your organisation knows about an existing
            process to gather and understand the data requirements of various
            stakeholders in the sector.
          </li>
        </ul>
      </div>

      {areas.length > 0
        ? <form>
            {areas.map(area =>
              <div key={area} style={{ marginBottom: "20px" }}>
                <h3 className="font-bold">
                  {area}
                </h3>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name={area}
                      value="Yes"
                      onChange={() => handleRadioChange(area, "Yes")}
                      checked={responses[area] === "Yes"}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={area}
                      value="Partially"
                      onChange={() => handleRadioChange(area, "Partially")}
                      checked={responses[area] === "Partially"}
                    />
                    Partially
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={area}
                      value="No"
                      onChange={() => handleRadioChange(area, "No")}
                      checked={responses[area] === "No"}
                    />
                    No
                  </label>
                </div>
              </div>
            )}
            {/* Display error message */}
            {errorMessage &&
              <div className="text-red-500 mt-4">
                {errorMessage}
              </div>}
            <button type="button" onClick={handleSubmit}>
              Next
            </button>
          </form>
        : <p>
            No areas to display. Check if the areas are passed correctly in the
            URL.
          </p>}
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2bii />
  </Suspense>;

export default SuspenseWrapper;
