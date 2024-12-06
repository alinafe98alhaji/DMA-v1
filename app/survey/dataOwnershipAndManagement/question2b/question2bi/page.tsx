"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
export const dynamic = "force-dynamic";

const Question2bi = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
  const [areas, setAreas] = useState<string[]>([]);

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

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
    if (value !== "") {
      setErrorMessage(""); // Clear error message when user starts typing
    }
  };

  const handleSubmit = async () => {
    // Check if all areas have been filled out
    for (const area of areas) {
      if (!responses[area] || responses[area].trim() === "") {
        setErrorMessage("Please provide a response for all areas.");
        return;
      }
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
      questionID: "2b.i", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
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
        // Navigate to the next page, e.g., 2.b.ii
        router.push(
          `/survey/dataOwnershipAndManagement/question2b/question2bii?areas=${encodeURIComponent(
            JSON.stringify(areas)
          )}`
        );
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
            Data Ownership and Management Assessment Organisational Level
          </h1>
          <li>
            Determine which department is responsible for managing and
            facilitating the central mechanism for staff data needs.
          </li>
        </ul>
      </div>
      <h1 className="mb-4 mt-4">
        2.b.i Which department is mandated to coordinate these processes?
      </h1>

      {areas.length > 0
        ? <form>
            {areas.map(area =>
              <div key={area} style={{ marginBottom: "20px" }}>
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
            {/* Display error message */}
            {errorMessage &&
              <div className="text-red-500 mt-4">
                {errorMessage}
              </div>}
            <button type="button" onClick={handleSubmit}>
              Next
            </button>
          </form>
        : <p>No areas to display.</p>}
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question2bi />
  </Suspense>;

export default SuspenseWrapper;
