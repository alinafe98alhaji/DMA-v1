// "use client"; // This is necessary for client-side hooks in Next.js

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const Question1dV = () => {
//   const searchParams = useSearchParams();
//   const areasFor1dv = searchParams.get("areasFor1dv"); // Get the areas passed from the URL

//   const [areas, setAreas] = useState<string[]>([]);
//   const [responses, setResponses] = useState<Record<string, string>>({});
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const router = useRouter(); // Hook to handle routing

//   // Map responses to scores
//   const responseScores: Record<string, number> = {
//     Yes: 1,
//     Partially: 0.5,
//     No: 0
//   };

//   useEffect(
//     () => {
//       if (areasFor1dv) {
//         const areasArray = JSON.parse(areasFor1dv); // Parse the areasFor1dv from query string
//         setAreas(areasArray); // Store them in state
//       }
//     },
//     [areasFor1dv]
//   );

//   // Handle option change for each area
//   const handleOptionChange = (area: string, value: string) => {
//     // Remove error message when user starts selecting an option
//     if (!responses[area]) {
//       setErrorMessage(""); // Clear the error message if the user starts selecting
//     }

//     setResponses(prev => ({ ...prev, [area]: value }));
//   };

//   // Validation for the Next button
//   const handleNext = async () => {
//     // Ensure all areas have been answered
//     const allAnswered = areas.every(area => responses[area]);
//     if (!allAnswered) {
//       setErrorMessage("Please select an option for every area.");
//       return;
//     }

//     // If all are answered, clear any previous error message and proceed
//     setErrorMessage("");

//     // Retrieve user_id from sessionStorage
//     const userId_ses = sessionStorage.getItem("user_id");

//     if (!userId_ses) {
//       alert("User ID is missing. Please return to the basic details page.");
//       return;
//     }

//     // Log responses with questionID
//     const responseObject = {
//       userId: userId_ses,
//       questionID: "1d.v", // Adding questionID
//       responses: Object.entries(responses).map(([area, response]) => ({
//         area,
//         response,
//         score: responseScores[response] // Attach the score to the response
//       }))
//     };

//     // Send data to your API
//     fetch("/api/saveResponses", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(responseObject)
//     })
//       .then(res => {
//         if (!res.ok) {
//           throw new Error("Failed to save responses");
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log("Responses saved successfully:", data);
//         // Proceed to next question
//         // Navigate to the next page
//         router.push("/survey/dataOwnershipAndManagement/question2a");
//       })
//       .catch(err => {
//         console.error("Error saving responses:", err);
//       });
//   };

//   // If no areas are selected, return a message
//   if (areas.length === 0) {
//     return <div>No areas to display.</div>;
//   }

//   return (
//     <div className="p-6">
//       {/* Guidance Instructions */}
//       <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
//         <h2 className="text-lg font-bold mb-4 text-blue-800">
//           Guidance Instructions
//         </h2>
//         <ul className="list-disc pl-6 text-black">
//           <h1 className="mb-4 text-lg font-bold">
//             Data Collection Assessment Organisational Level
//           </h1>
//           <li>
//             This question examines if your organisation has internal digital
//             tools for data collection
//           </li>
//         </ul>
//       </div>

//       <h1>
//         1.d.v: Does your organisation have internal standardised digital tools
//         for data collection?
//       </h1>

//       {areas.map((area, index) =>
//         <div className="mb-4 mt-4" key={index}>
//           <label>
//             {area}
//           </label>
//           <div>
//             <label>
//               <input
//                 type="radio"
//                 name={area}
//                 value="Yes"
//                 checked={responses[area] === "Yes"}
//                 onChange={() => handleOptionChange(area, "Yes")}
//               />
//               Yes
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name={area}
//                 value="Partially"
//                 checked={responses[area] === "Partially"}
//                 onChange={() => handleOptionChange(area, "Partially")}
//               />
//               Partially
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name={area}
//                 value="No"
//                 checked={responses[area] === "No"}
//                 onChange={() => handleOptionChange(area, "No")}
//               />
//               No
//             </label>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {errorMessage &&
//         <div className="text-red-500 mt-4">
//           {errorMessage}
//         </div>}

//       {/* Next Button */}
//       <div className="navigation-buttons mt-4">
//         <button
//           onClick={handleNext}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Question1dV;

//-------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

"use client"; // Ensure the code runs only client-side

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Correct hook for routing in App Router
export const dynamic = "force-dynamic";

// List of areas that need to be rendered for this question
const areas = [
  "Urban Water Supply Coverage",
  "Urban Sanitation Sector Coverage",
  "Rural Water Supply Sector Coverage",
  "Rural Sanitation Sector Coverage",
  "Finance",
  "Regulation",
  "Utility Operations: Technical, Commercial, Financial, HR"
];

// Define the responses object type based on the areas
type Responses = {
  [key in typeof areas[number]]: "Yes" | "Partially" | "No" | null
};

const Question1dv = () => {
  // Initialize state to track user responses for each area
  const [responses, setResponses] = useState<Responses>({
    "Urban Water Supply Coverage": null,
    "Urban Sanitation Sector Coverage": null,
    "Rural Water Supply Sector Coverage": null,
    "Rural Sanitation Sector Coverage": null,
    Finance: null,
    Regulation: null,
    "Utility Operations: Technical, Commercial, Financial, HR": null
  });

  // State to track validation error
  const [error, setError] = useState(false);

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Get router instance for navigation
  const router = useRouter();

  // Handler to update responses when a user selects a radio button
  const handleSelection = (area: string, value: "Yes" | "Partially" | "No") => {
    setResponses(prev => ({ ...prev, [area]: value }));
    setError(false); // Clear error when a valid selection is made
  };

  // Validation function to check if all responses are filled
  const isFormValid = () => {
    return Object.values(responses).every(response => response !== null);
  };

  // Handle form submission
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError(true);
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
      questionID: "1d.v", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: response ? responseScores[response] : 0 // Include the score
      }))
    };

    // Send data to your API
    fetch("/api/saveResponses", {
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
        // Navigate to the next page if valid
        router.push("/survey/dataOwnershipAndManagement/question2a");
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

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
            This question examines if your organisation has internal digital
            tools for data collection
          </li>
        </ul>
      </div>

      <h1>
        1.d.v Does your organisation have internal standardised digital tools
        for data collection?
      </h1>

      <form onSubmit={handleNext}>
        {areas.map(area =>
          <div key={area} className="mb-4 mt-4 area-section">
            <label className="area-label">
              <strong>
                {area}
              </strong>
            </label>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Yes"
                  checked={responses[area] === "Yes"}
                  onChange={() => handleSelection(area, "Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="Partially"
                  checked={responses[area] === "Partially"}
                  onChange={() => handleSelection(area, "Partially")}
                />
                Partially
              </label>
              <label>
                <input
                  type="radio"
                  name={area}
                  value="No"
                  checked={responses[area] === "No"}
                  onChange={() => handleSelection(area, "No")}
                />
                No
              </label>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error &&
          <p className="text-red-500 mt-2">
            Please answer all questions before proceeding.
          </p>}

        {/* Next button to navigate to the next page */}
        <div className="navigation-buttons">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Question1dv;
