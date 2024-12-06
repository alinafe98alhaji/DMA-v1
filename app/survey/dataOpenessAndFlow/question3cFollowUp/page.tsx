"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
export const dynamic = "force-dynamic";

const Question3cFollowUp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null); // Error state for validation

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
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = () => {
    // Check if all inputs are filled
    const allFilled = areas.every(
      area => responses[area] && responses[area].trim() !== ""
    );
    if (!allFilled) {
      setError("Please provide details for all areas before proceeding.");
      return;
    }

    console.log("Follow-up responses:", responses);

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "3c.i", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    // Send data to your API
    fetch("/api/nationalLevel", {
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
        // Navigate to 3.a.ii
        router.push(`/survey/dataOpenessAndFlow/question3c/question3cii`);
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
            Data Openness and Flow Assessment National Level
          </h1>
          <li>
            Look for documented open data policies that outline the principles
            of data transparency, accessibility, and reuse.
          </li>
          <li>
            Check if these policies define which data should be openly shared
            and under what conditions, as well as any restrictions on sensitive
            or private data.
          </li>
        </ul>
      </div>
      <h1>
        3.c.i • Which organisation is mandated to define rules for public data
        sharing?
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
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {error &&
              <p className="text-red-500">
                {error}
              </p>}{" "}
            {/* Validation error */}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Next
            </button>
          </form>
        : <p>No areas to display.</p>}
    </div>
  );
};

export default Question3cFollowUp;
