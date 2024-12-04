"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Question3aFollowUp = () => {
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
    // Clear error when the user starts typing
    if (value.trim() !== "") {
      setError(""); // Clear error when there's input
    }

    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
  };

  // Validation check
  const validateForm = () => {
    // Check if all areas have an input (non-empty)
    const emptyFields = areas.filter(
      area => !responses[area] || responses[area].trim() === ""
    );
    if (emptyFields.length > 0) {
      setError("Please fill in all areas.");
      return false;
    }
    setError("");
    return true;
  };

  // Handle submission
  const handleSubmit = async () => {
    // Perform validation
    if (!validateForm()) {
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
      questionID: "3a.i", // Adding questionID
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
        // Navigate to 3.a.ii
        router.push(`/survey/dataOpenessAndFlow/question3a/question3aii`);
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
            Identify the organisation responsible for setting these data models
            and metadata standards. This could be a national standards body, a
            regulatory agency, or a sector-specific organisation.
          </li>
        </ul>
      </div>
      <h1>
        3.a.i • Which organisation is mandated to define these rules and
        processes to support data sharing?
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
            {error &&
              <p className="text-red-500">
                {error}
              </p>}
            <button type="button" onClick={handleSubmit}>
              Next
            </button>
          </form>
        : <p>No areas to display.</p>}
    </div>
  );
};

export default Question3aFollowUp;
