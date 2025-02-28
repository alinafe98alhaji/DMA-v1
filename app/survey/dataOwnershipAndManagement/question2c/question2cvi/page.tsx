"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
export const dynamic = "force-dynamic";

const Question2cVI = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasFor2cvi = searchParams.get("areasFor2cvi");

  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Parse the areas from the URL query parameter
  useEffect(
    () => {
      if (areasFor2cvi) {
        try {
          const areasArray = JSON.parse(areasFor2cvi);
          setAreas(areasArray);
        } catch (error) {
          console.error("Error parsing areas:", error);
        }
      }
    },
    [areasFor2cvi]
  );

  const handleRadioChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear error message when user starts answering
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async () => {
    // Check if all areas have a response
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setErrorMessage(
        "Please provide a response for all areas before proceeding."
      );
      return;
    }

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
      questionID: "2c.vi", // Adding questionID
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
        // Filter areas based on "Yes," "Partially," or "No" responses
        const filteredAreas = areas.filter(
          area =>
            responses[area] === "Yes" ||
            responses[area] === "Partially" ||
            responses[area] === "No"
        );

        // Navigate to the next step with the filtered areas
        router.push(
          `/survey/dataOwnershipAndManagement/question2c/question2cvii?areasFor2cvii=${encodeURIComponent(
            JSON.stringify(filteredAreas)
          )}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  if (areas.length === 0) {
    return <div>No areas to display.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data Ownership and Management</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-gray-900 text-lg font-bold mb-4">
          2.c.vi: Does your organisation have management mechanisms for
          cybersecurity threats?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question examines if your organisation has mechanisms in place
            to prevent and respond to cybersecurity threats.
          </li>
        </ul>
      </div>

      {areas.map((area, index) =>
        <div className="mb-4 mt-4" key={index}>
          <label className="block font-semibold mb-2">
            {area}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={area}
                value="Yes"
                onChange={() => handleRadioChange(area, "Yes")}
                checked={responses[area] === "Yes"}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={area}
                value="Partially"
                onChange={() => handleRadioChange(area, "Partially")}
                checked={responses[area] === "Partially"}
              />
              Partially
            </label>
            <label className="flex items-center gap-2">
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

      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Next
      </button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2cVI />
  </Suspense>;

export default SuspenseWrapper;
