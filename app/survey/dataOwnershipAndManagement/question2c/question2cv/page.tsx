"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Question2cV = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasFor2cv = searchParams.get("areasFor2cv");

  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  useEffect(
    () => {
      if (areasFor2cv) {
        try {
          const areasArray = JSON.parse(areasFor2cv);
          setAreas(areasArray);
        } catch (error) {
          console.error("Error parsing areas:", error);
        }
      }
    },
    [areasFor2cv]
  );

  const handleRadioChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    // Clear the error message if it's already set
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async () => {
    // Ensure all areas have been answered
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setErrorMessage("Please provide a response for all areas.");
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
      questionID: "2c.v", // Adding questionID
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
        // Filter out areas with "No" responses
        const filteredAreas = areas.filter(area => responses[area] !== "No");

        // Navigate to 2.c.vi
        router.push(
          `/survey/dataOwnershipAndManagement/question2c/question2cvi?areasFor2cvi=${encodeURIComponent(
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
            This question asks if your organisation knows about cybersecurity
            threats within the sector and ensures its security.
          </li>
        </ul>
      </div>

      <h1 className="text-xl font-bold mb-6">
        2.c.v: Is your organisation aware of cybersecurity threats in the WSS
        sector?
      </h1>

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

export default Question2cV;
