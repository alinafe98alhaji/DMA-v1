"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Question2cFollowUp = () => {
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
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear the error message if a response is entered
    if (value) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    // Check if all areas have a response
    for (const area of areas) {
      if (!responses[area]) {
        setErrorMessage("Please provide a response for all areas.");
        return;
      }
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
      questionID: "2c.i", // Adding questionID
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
        // If all areas have responses, proceed to the next page
        console.log("Follow-up responses:", responses);
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
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Ownership and Management Assessment National Level
          </h1>
          <li>
            Identify the organisation tasked with overseeing data protection.
            This could be a national data protection authority, a regulatory
            agency, or a dedicated data security unit within the water and
            sanitation sector.
          </li>
          <li>
            Confirm their role in monitoring compliance and enforcing data
            protection standards.
          </li>
        </ul>
      </div>
      <h1>
        2.c.i Which organisation is mandated to ensure that data protection
        rules are understood and complied with?
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
            {/* Display error message if any area is left unanswered */}
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

export default Question2cFollowUp;
