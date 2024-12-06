"use client"; // This is necessary for client-side hooks in Next.js

import { useRouter } from "next/navigation";
import { useState } from "react";

const Question2dii = () => {
  const router = useRouter();

  // Predefined seven areas
  const areas = [
    "Urban Water Supply Coverage",
    "Urban Sanitation Sector Coverage",
    "Rural Water Supply Sector Coverage",
    "Rural Sanitation Sector Coverage",
    "Finance",
    "Regulation",
    "Utility Operations: Technical, Commercial, Financial, HR"
  ];

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Word options for the radio buttons
  const wordOptions = [
    "Resource Limitations: Insufficient budget or technology to meet the standards.",
    "Technical Compatibility: Existing systems are incompatible with new standards.",
    "Inadequate Training: Employees are not adequately trained on the new standards.",
    "Organisational Priorities: Other strategic priorities take precedence over updating data storage practices.",
    "Inadequate staff: Some support is provided but it's not comprehensive, causing frequent issues"
  ];

  // Handle option change for each area
  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (errorMessage) setErrorMessage(""); // Clear error message if a response is selected
  };

  // Handle submit action
  const handleSubmit = async () => {
    // Check if all areas have been answered
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setErrorMessage("Please answer all areas before proceeding.");
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
      questionID: "2d.ii", // Adding questionID
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
        router.push("/survey/dataOpenessAndFlow/question3a");
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
            Data Ownership and Management Assessment Organisational Level
          </h1>
          <li>
            This question evaluates if your organisation has the necessary
            resources and support to follow the storage and backup standards.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        2.d.ii: How well equipped is your organisation in complying with data
        storage and backup rules
      </h1>

      {/* Table displaying the areas and options */}
      <table className="w-full table-auto border-collapse">
        <thead className="bg-black text-white">
          <tr>
            <th className="p-4 border border-gray-700">Area</th>
            {wordOptions.map(option =>
              <th key={option} className="p-4 border border-gray-700">
                {option}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {areas.map((area, index) =>
            <tr
              key={area}
              className="hover:bg-gray-50 transition-all duration-200 ease-in-out"
            >
              <td className="p-4 font-semibold border border-gray-700">
                {area}
              </td>
              {wordOptions.map(option =>
                <td key={option} className="p-4 border border-gray-700">
                  <div className="flex justify-center items-center">
                    <input
                      type="radio"
                      name={area}
                      value={option}
                      checked={responses[area] === option}
                      onChange={() => handleOptionChange(area, option)}
                      className="mr-2"
                    />
                  </div>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      {/* Error message */}
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Submit
      </button>
    </div>
  );
};

export default Question2dii;
