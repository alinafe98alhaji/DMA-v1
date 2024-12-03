"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Question1CI = () => {
  const searchParams = useSearchParams();
  const responsesQuery = searchParams.get("responses");

  const [responses, setResponses] = useState<any>(null);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (responsesQuery) {
      const parsedResponses = JSON.parse(responsesQuery);
      setResponses(parsedResponses);

      // Filter areas with Yes or Partially
      const areas = Object.keys(parsedResponses).filter(
        area =>
          parsedResponses[area] === "Yes" ||
          parsedResponses[area] === "Partially"
      );
      setFilteredAreas(areas);
    }
  }, [responsesQuery]);

  // Handle Next button click with validation
  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    // Ensure all filtered areas are answered
    const allAnswered = filteredAreas.every((area) => {
      const selectedValue = document.querySelector(`input[name="${area}"]:checked`);
      return selectedValue !== null;
    });
  
    if (!allAnswered) {
      setError("Please respond to all areas before submitting.");
      return;
    }
  
    setError(""); // Clear error if validation passes
  
    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
  
    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }
  
    // Build response object with only filtered areas
    const filteredResponses = filteredAreas.map((area) => ({
      area,
      response: responses[area], // Use the current state of responses
    }));
  
    const responseObject = {
      userId: userId_ses,
      questionID: "1c.i",
      responses: filteredResponses,
      submittedAt: new Date().toISOString(), // Add a submission timestamp
    };
  
    console.log("Filtered Response Payload:", responseObject); // Debugging
  
    // Send filtered data to your API
    fetch("/api/saveResponses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseObject),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to save responses");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Responses saved successfully:", data);
  
        // Proceed to the next page
        const nextPageLink = `/survey/dataCollection/question1c/question1cii?responses=${encodeURIComponent(
          JSON.stringify(responses)
        )}`;
        window.location.href = nextPageLink;
      })
      .catch((err) => {
        console.error("Error saving responses:", err);
      });
  };
  

  // Handle radio button selection to clear error when selected
  const handleRadioChange = (area: string, value: string) => {
    setResponses((prev: any) => ({
      ...prev,
      [area]: value
    }));

    // Clear the error message when the user starts making a selection
    setError("");
  };

  if (!responses) return <div>Loading...</div>; // Wait until responses are loaded

  return (
    <div className="p-6 survey-container">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Collection Assessment Organisational Level
          </h1>
          <li>
            This question asks how effective the resourcing strategy is for your
            organisation.
          </li>
        </ul>
      </div>

      <h1>
        1.c.i. How well have the resources ensured the sustainability of your
        organisation's data collection processes?
      </h1>

      {/* Table layout */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Areas</th>
              <th className="border border-gray-300 p-2 text-center">
                The existing resourcing is completely inadequate, and cannot
                support basic sustainability needs.
              </th>
              <th className="border border-gray-300 p-2 text-center">
                The allocated resources address some short-term needs but lack
                future-focused sustainability.
              </th>
              <th className="border border-gray-300 p-2 text-center">
                The available resources partially address sustainability but is not fully comprehensive
              </th>
              <th className="border border-gray-300 p-2 text-center">
                A comprehensive budget is in place but not fully optimised, with some sustainability gaps remaining.
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Comprehensive resources are allocated and implemented that ensure long-term sustainability of data collection.
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAreas.map(area =>
              <tr key={area} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="The existing resourcing is completely inadequate, and cannot
                    support basic sustainability needs."
                    checked={responses[area] === "The existing resourcing is completely inadequate, and cannot support basic sustainability needs."}
                    onChange={() =>
                      handleRadioChange(area, "The existing resourcing is completely inadequate, and cannot support basic sustainability needs.")
                    }
                  />
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="The allocated resources address some short-term needs but lack future-focused sustainability."
                    checked={responses[area] === "The allocated resources address some short-term needs but lack future-focused sustainability."}
                    onChange={() =>
                      handleRadioChange(area, "The allocated resources address some short-term needs but lack future-focused sustainability.")
                    }
                  />
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="The available resources partially address sustainability but is not fully comprehensive"
                    checked={responses[area] === "The available resources partially address sustainability but is not fully comprehensive"}
                    onChange={() =>
                      handleRadioChange(area, "The available resources partially address sustainability but is not fully comprehensive")
                    }
                  />
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="A comprehensive budget is in place but not fully optimised, with some sustainability gaps remaining."
                    checked={responses[area] === "A comprehensive budget is in place but not fully optimised, with some sustainability gaps remaining."}
                    onChange={() =>
                      handleRadioChange(area, "A comprehensive budget is in place but not fully optimised, with some sustainability gaps remaining.")
                    }
                  />
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="radio"
                    name={area}
                    value="Comprehensive resources are allocated and implemented that ensure long-term sustainability of data collection."
                    checked={responses[area] === "Comprehensive resources are allocated and implemented that ensure long-term sustainability of data collection."}
                    onChange={() =>
                      handleRadioChange(area, "Comprehensive resources are allocated and implemented that ensure long-term sustainability of data collection.")
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error message display */}
      {error &&
        <p className="text-red-500">
          {error}
        </p>}

      {/* Next Button */}
      <div className="navigation-buttons mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question1CI;
