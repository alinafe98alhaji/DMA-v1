"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
export const dynamic = "force-dynamic";

const Question2cVII = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasFor2cvii = searchParams.get("areasFor2cvii");

  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(
    () => {
      if (areasFor2cvii) {
        try {
          const areasArray = JSON.parse(areasFor2cvii);
          setAreas(areasArray);
        } catch (error) {
          console.error("Error parsing areas:", error);
        }
      }
    },
    [areasFor2cvii]
  );

  const handleRadioChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));

    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async () => {
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setErrorMessage(
        "Please provide a response for all areas before submitting."
      );
      return;
    }
  
    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
  
    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }
  
    // Construct the response object in the required format
    const responseObject = {
      userId: userId_ses,
      questionID: "2c.vii", // Adding questionID
      responses: Object.entries(responses).map(([area, score]) => ({
        area,
        response: options.find(option => option.score === score)?.label || "",
        score: parseFloat(score)
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
        // Proceed to the next question
        router.push("/survey/dataOwnershipAndManagement/question2d");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };
  

  const options = [
    {
      label:
        "Cybersecurity threats have been ignored as there has been no prior incidence.",
      score: "0.2"
    },
    {
      label:
        "Cybersecurity threats are not considered as we have minimal exposure on existing systems.",
      score: "0.4"
    },
    {
      label:
        "Some minor considerations have been put in place to mitigate against possible cyberthreats though more awareness and training is required.",
      score: "0.6"
    },
    {
      label:
        "Medium-level mechanisms against cyberthreats are in place with funding limitation.",
      score: "0.8"
    },
    {
      label:
        "Cybersecurity mechanisms are fully implemented in anticipation of a broad spectrum of possible threats.",
      score: "1"
    }
  ];

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
            This question examines why/why not your organisation has put in
            place mechanisms to prevent/respond to cybersecurity threats.
          </li>
        </ul>
      </div>
      <h1 className="text-xl font-bold mb-6">
        2.c.vii: Does your organisation have management mechanisms for
        cybersecurity threats?
      </h1>

      {/* Tabular Layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Area
              </th>
              {options.map((option, index) =>
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {option.label}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {areas.map((area, index) =>
              <tr
                key={index}
                className="border-t border-gray-300 hover:bg-gray-100 transition duration-300"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {area}
                </td>
                {options.map((option, optIndex) =>
                  <td
                    key={optIndex}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    <input
                      type="radio"
                      name={area}
                      value={option.score}
                      onChange={() => handleRadioChange(area, option.score)}
                      checked={responses[area] === option.score}
                    />
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Submit
      </button>
    </div>
  );
};

export default Question2cVII;
