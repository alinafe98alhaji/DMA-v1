"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Question3bFollowUp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas");
  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  // Parse the areas query parameter
  useEffect(
    () => {
      if (areasParam) {
        try {
          const decodedAreas = decodeURIComponent(areasParam).split("|");
          setAreas(decodedAreas);
        } catch (error) {
          console.error("Error parsing areas:", error);
        }
      }
    },
    [areasParam]
  );

  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear error message when input is changed
    if (error) setError("");
  };

  const handleSubmit = async () => {
    // Check if all areas have responses
    const allAnswered = areas.every(area => {
      const response = responses[area];
      return response && response.trim() !== ""; // Ensure input is not empty or just whitespace
    });

    if (!allAnswered) {
      setError("Please provide input for all areas before proceeding.");
      return; // Stop navigation if validation fails
    }

    // If validation passes
    setError(""); // Clear error

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "3b.i", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
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
        console.log("Follow-up responses:", responses);
        router.push(`/survey/dataOpenessAndFlow/question3b/question3bii`);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Openess and Flow Assessment National Level
          </h1>
          <li>
            Identify the organisation responsible for developing and managing
            these technical systems. This could be a national IT agency, a
            regulator, a dedicated technical unit within the sector, or a
            contracted technology provider.
          </li>
        </ul>
      </div>

      <h1>
        3.b.i • Which organisation is mandated to develop and maintain technical
        platforms to facilitate data consolidation and sharing?
      </h1>

      {areas.length > 0
        ? <form>
            {areas.map(area =>
              <div
                key={area}
                style={{ marginBottom: "20px", marginTop: "20px" }}
              >
                <h3>
                  {area}
                </h3>
                <input
                  type="text"
                  placeholder={`Enter details for ${area}`}
                  value={responses[area] || ""}
                  onChange={e => handleInputChange(area, e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            )}

            {/* Display error message */}
            {error &&
              <p className="text-red-500">
                {error}
              </p>}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </form>
        : <p>No areas to display.</p>}
    </div>
  );
};

export default Question3bFollowUp;
