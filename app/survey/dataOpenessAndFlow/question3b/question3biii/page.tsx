"use client"; // Ensure the code is only executed client-side

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // New hook to read query params
import { useRouter } from "next/navigation"; // Import useRouter for programmatic navigation
export const dynamic = "force-dynamic";

const Question3biii = () => {
  const searchParams = useSearchParams();
  const responsesQuery = searchParams.get("responses");

  const [responses, setResponses] = useState<any>(null);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({}); // Type the selectedOptions state
  const [valid, setValid] = useState<boolean>(true); // Initially valid, only become valid after all questions are answered
  const [showError, setShowError] = useState<boolean>(false); // To control the error message display

  const router = useRouter(); // Initialize the router

  useEffect(
    () => {
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
    },
    [responsesQuery]
  );

  useEffect(
    () => {
      const allAnswered = filteredAreas.every(area => selectedOptions[area]);
      setValid(allAnswered);
    },
    [selectedOptions, filteredAreas]
  ); // Re-run validation when selectedOptions or filteredAreas change

  // Handle the change in selected option for a specific area
  const handleSelectionChange = (area: string, value: string) => {
    setSelectedOptions((prev: any) => {
      const updated = { ...prev, [area]: value };
      validateForm(updated); // Validate on every change
      return updated;
    });
  };

  // Validate if all required areas have a selected option
  const validateForm = (selected: any) => {
    const allAnswered = filteredAreas.every(area => selected[area]);
    setValid(allAnswered); // Update the validation state
  };

  // Map responses to corresponding score values
  const responseToScore = (response: string) => {
    // Ensure response is treated as a string
    const responseStr = response as string;
    switch (responseStr) {
      case "Centralised platforms don't connect different data sources well, causing major problems in data sharing.":
        return 0.2; // Return numeric score
      case "Some integration features exist, but systems often have compatibility issues and support limited data formats, leading to occasional disruptions with frequent downtimes.":
        return 0.4; // Return numeric score
      case "Systems are improving, with better integration and support for common data formats, but still lack robustness and speed. The user interface is too complex, making it difficult for users to operate efficiently.":
        return 0.6; // Return numeric score
      case "Systems are well-integrated, supporting many data formats and ensuring reliable data transfer with minimal delays or errors. Staff lack adequate training to use the systems effectively, leading to underutilisation.":
        return 0.8; // Return numeric score
      case "Centralised systems are top-notch, connecting all data sources seamlessly with high reliability, speed, and no compatibility issues, ensuring optimal data sharing.":
        return 1.0; // Return numeric score
      default:
        return 0; // Return 0 if response is not matched
    }
  };

  // Handle the Next button click, preventing navigation if form is invalid
  const handleNextClick = async (e: React.MouseEvent) => {
    // If not valid, stop navigation
    if (!valid) {
      e.preventDefault(); // Prevent navigation if the form is invalid
      setShowError(true); // Show the error message
      return; // Stop further action
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId_ses || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Filter the responses to include only those with selected answers
    const filteredResponses = Object.entries(
      selectedOptions
    ).map(([area, response]) => ({
      area,
      response,
      score: responseToScore(response) // Include the score in the response object
    }));

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      completionId,
      questionID: "3b.iii", // Adding questionID
      responses: filteredResponses
    };

    // Send data to your API
    fetch("/api/saveDataOpenessAndFlow", {
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
        const nextPage = "/survey/dataOpenessAndFlow/question3b/question3biv";

        // Combine responses with the selected options and create the query string
        const updatedResponses = { ...responses, ...selectedOptions };
        const queryParams = new URLSearchParams({
          responses: JSON.stringify(updatedResponses)
        }).toString();

        // Navigate to the next page with the updated query parameters
        router.push(`${nextPage}?${queryParams}`);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  // Hide error when user starts selecting
  const handleSelectionChangeWithErrorHide = (area: string, value: string) => {
    handleSelectionChange(area, value);
    if (showError) setShowError(false); // Hide the error message when the user selects an option
  };

  if (!responses) return <div>Loading...</div>; // Wait until responses are loaded

  return (
    <div className="survey-container p-6">
      <h1 className="mb-4 text-lg font-bold">Data Openness and Flow</h1>
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50 shadow-md">
        <h1 className="text-lg text-gray-900 font-bold mb-4">
          3.b.iii. How effective are these centralised platforms in facilitating
          data sharing?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question evaluates the practicality and implementation success
            of the technical systems for data sharing.
          </li>
        </ul>
      </div>

      {/* Error message */}
      {showError &&
        !valid &&
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <strong>Error:</strong> Please answer all questions before proceeding.
        </div>}

      <table className="w-full mb-6 border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2" />
            <th className="border p-2">
              Centralised platforms don't connect different data sources well,
              causing major problems in data sharing.
            </th>
            <th className="border p-2">
              Some integration features exist, but systems often have
              compatibility issues and support limited data formats, leading to
              occasional disruptions with frequent downtimes.
            </th>
            <th className="border p-2">
              Systems are improving, with better integration and support for
              common data formats, but still lack robustness and speed. The user
              interface is too complex, making it difficult for users to operate
              efficiently.
            </th>
            <th className="border p-2">
              Systems are well-integrated, supporting many data formats and
              ensuring reliable data transfer with minimal delays or errors.
              Staff lack adequate training to use the systems effectively,
              leading to underutilisation.
            </th>
            <th className="border p-2">
              Centralised systems are top-notch, connecting all data sources
              seamlessly with high reliability, speed, and no compatibility
              issues, ensuring optimal data sharing.
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAreas.map(area =>
            <tr key={area}>
              <td className="font-bold border p-2 text-left">
                {area}
              </td>
              {[
                "Centralised platforms don't connect different data sources well, causing major problems in data sharing.",
                "Some integration features exist, but systems often have compatibility issues and support limited data formats, leading to occasional disruptions with frequent downtimes.",
                "Systems are improving, with better integration and support for common data formats, but still lack robustness and speed. The user interface is too complex, making it difficult for users to operate efficiently.",
                "Systems are well-integrated, supporting many data formats and ensuring reliable data transfer with minimal delays or errors. Staff lack adequate training to use the systems effectively, leading to underutilisation.",
                "Centralised systems are top-notch, connecting all data sources seamlessly with high reliability, speed, and no compatibility issues, ensuring optimal data sharing."
              ].map(value =>
                <td
                  key={value}
                  className="border hover:bg-blue-100 Sborder p-2 text-center"
                >
                  <input
                    type="radio"
                    name={area}
                    value={value}
                    checked={selectedOptions[area] === value}
                    onChange={() =>
                      handleSelectionChangeWithErrorHide(area, value)}
                  />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      <div className="navigation-buttons">
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question3biii />
  </Suspense>;

export default SuspenseWrapper;
