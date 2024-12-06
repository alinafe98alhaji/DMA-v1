"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
export const dynamic = "force-dynamic";

const Question5cFollowUp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
  const [areas, setAreas] = useState<string[]>([]);

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

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
  };

  const handleSubmit = () => {
    // Check if all areas have been filled
    const unansweredAreas = areas.filter(area => !responses[area]);

    if (unansweredAreas.length > 0) {
      // Show error message if there are unanswered areas
      setError("Please fill in all the required fields before proceeding.");
      return;
    }

    // Clear error if all areas are answered
    setError("");

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "5c.i", // Adding questionID
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

        // Submit responses and navigate
        console.log("Follow-up responses:", responses);
        router.push(`/survey/dataUse/question5c/question5cii`);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  // Use effect to clear error message when user starts entering data
  useEffect(
    () => {
      // Clear error if any input field is filled
      if (Object.values(responses).some(response => response !== "")) {
        setError("");
      }
    },
    [responses]
  );

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Use Assessment National Level
          </h1>
          <li>
            Identify the organisation responsible for developing and maintaining
            sector-wide KPIs. This could be a national authority, a regulatory
            body, or a sector-specific performance monitoring unit.
          </li>
        </ul>
      </div>
      <h1>
        5.c.i Which organisation is mandated to develop and maintain standard
        sector wide KPIs?
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
                />
              </div>
            )}

            {/* Display error message if there are unanswered areas */}
            {error &&
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>}

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          </form>
        : <p>No areas to display.</p>}
    </div>
  );
};

export default Question5cFollowUp;
