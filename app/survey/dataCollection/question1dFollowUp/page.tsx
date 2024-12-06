"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
export const dynamic = "force-dynamic";

const Question1dFollowUp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>(""); // State to track validation errors

  // Parse the areas query parameter
  useEffect(() => {
    if (areasParam) {
      try {
        const decodedAreas = decodeURIComponent(areasParam).split("|");
        setAreas(decodedAreas);
      } catch (error) {
        console.error("Error parsing areas:", error);
      }
    }
  }, [areasParam]);

  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear error when a valid input is provided
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    // Validate that all areas have been answered
    const allAnswered = areas.every(area => responses[area]?.trim());
    if (!allAnswered) {
      setError("Please provide responses for all areas before proceeding.");
      return; // Prevent navigation
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
      questionID: "1d.i", // Adding questionID
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
        console.log("Follow-up responses:", responses);
    // Navigate to 1.d.ii
    router.push(`/survey/dataCollection/question1d/question1dii`);
  })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  

     };

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Collection Assessment National Level
          </h1>
          <li>
          Identify the organisation that develops and manages the digital tools for data collection. This could be a national IT agency, a specialised technical unit within the water sector, or a contracted technology provider.
          </li>
        </ul>
      </div>
      <h1>
        1.d.i: Which organisation is mandated to develop and maintain digital tools for
        data collection?
      </h1>
      {areas.length > 0 ? (
        <form>
          {areas.map(area => (
            <div key={area} style={{ marginBottom: "20px" }}>
              <h3>{area}</h3>
              <input
                type="text"
                placeholder={`Enter details for ${area}`}
                value={responses[area] || ""}
                onChange={e => handleInputChange(area, e.target.value)}
              />
            </div>
          ))}
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Display validation error */}
          <button type="button" onClick={handleSubmit}>
            Next
          </button>
        </form>
      ) : (
        <p>No areas to display.</p>
      )}
    </div>
  );
};

export default Question1dFollowUp;
