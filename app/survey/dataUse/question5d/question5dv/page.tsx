// "use client"; // This is necessary for client-side hooks in Next.js

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const Question5dV = () => {
//   const searchParams = useSearchParams();
//   const areasFor1dv = searchParams.get("areasFor1dv"); // Get the areas passed from the URL

//   const [areas, setAreas] = useState<string[]>([]);
//   const [responses, setResponses] = useState<{ [key: string]: string }>({});
//   const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
//   const [error, setError] = useState<string | null>(null);

//   // Map responses to scores
//   const responseScores: Record<string, number> = {
//     Yes: 1,
//     Partially: 0.5,
//     No: 0
//   };

//   useEffect(
//     () => {
//       if (areasFor1dv) {
//         const areasArray = JSON.parse(areasFor1dv); // Parse the areasFor1av from query string
//         setAreas(areasArray); // Store them in state
//       }
//     },
//     [areasFor1dv]
//   );

//   // Handle radio button changes
//   const handleInputChange = (area: string, value: string) => {
//     setResponses(prev => ({ ...prev, [area]: value }));
//     if (error) setError(null); // Clear the error message when user selects an option
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     // Ensure all areas have responses
//     const unansweredAreas = areas.filter(area => !responses[area]);
//     if (unansweredAreas.length > 0) {
//       setError("Please answer all questions before submitting.");
//       return;
//     }

//     // Retrieve user_id from sessionStorage
//     const userId_ses = sessionStorage.getItem("user_id");

//     // Log responses with questionID
//     const responseObject = {
//       userId: userId_ses,
//       questionID: "5d.v", // Adding questionID
//       responses: Object.entries(responses).map(([area, response]) => ({
//         area,
//         response,
//         score: responseScores[response] // Attach the score to the response
//       }))
//     };

//     // Send data to your API
//     fetch("/api/saveDataUse", {
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
//         setIsSubmitted(true);
//       })
//       .catch(err => {
//         console.error("Error saving responses:", err);
//         setError("An error occurred while submitting your responses.");
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
//             Data Use Assessment Organisational Level
//           </h1>
//           <li>
//             This question examines if your organisation conducts internal
//             training and capacity-building initiatives in data-related aspects.
//           </li>
//         </ul>
//       </div>
//       <h1>
//         5.d.v: Does your organisation run internal data-related capacity
//         building/training programmes?
//       </h1>
//       {areas.map((area, index) =>
//         <div key={index} className="mb-4 mt-4">
//           <label>
//             <strong>
//               {area}
//             </strong>
//           </label>
//           <div>
//             <label>
//               <input
//                 type="radio"
//                 name={area}
//                 value="Yes"
//                 checked={responses[area] === "Yes"}
//                 onChange={() => handleInputChange(area, "Yes")}
//               />
//               Yes
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name={area}
//                 value="Partially"
//                 checked={responses[area] === "Partially"}
//                 onChange={() => handleInputChange(area, "Partially")}
//               />
//               Partially
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name={area}
//                 value="No"
//                 checked={responses[area] === "No"}
//                 onChange={() => handleInputChange(area, "No")}
//               />
//               No
//             </label>
//           </div>
//         </div>
//       )}

//       {/* Submit Button */}
//       <div className="mt-6">
//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           disabled={isSubmitted} // Disable if already submitted
//         >
//           Submit
//         </button>
//       </div>

//       {/* Error Message */}
//       {error &&
//         <div className="mt-4 text-red-600">
//           {error}
//         </div>}

//       {/* Success Message */}
//       {isSubmitted &&
//         <div className="mt-4 text-green-600">
//           Responses submitted successfully!
//           <div>Assessment completed.</div>
//         </div>}
//     </div>
//   );
// };

// export default Question5dV;

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

"use client"; // This is necessary for client-side hooks in Next.js

import { useState, Suspense } from "react";
export const dynamic = "force-dynamic";

const Question5dV = () => {
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

  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const [error, setError] = useState<string | null>(null);

  // Map responses to scores
  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  // Handle radio button changes
  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (error) setError(null); // Clear the error message when user selects an option
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Ensure all areas have responses
    const unansweredAreas = areas.filter(area => !responses[area]);
    if (unansweredAreas.length > 0) {
      setError("Please answer all questions before submitting.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    // Log responses with questionID
    const responseObject = {
      userId: userId_ses,
      questionID: "5d.v", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response] // Attach the score to the response
      }))
    };

    // Send data to your API
    fetch("/api/saveDataUse", {
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
        setIsSubmitted(true);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
        setError("An error occurred while submitting your responses.");
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
            Data Use Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation conducts internal
            training and capacity-building initiatives in data-related aspects.
          </li>
        </ul>
      </div>
      <h1>
        5.d.v: Does your organisation run internal data-related capacity
        building/training programmes?
      </h1>
      {areas.map((area, index) =>
        <div key={index} className="mb-4 mt-4">
          <label>
            <strong>
              {area}
            </strong>
          </label>
          <div>
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleInputChange(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleInputChange(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleInputChange(area, "No")}
              />
              No
            </label>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitted} // Disable if already submitted
        >
          Submit
        </button>
      </div>

      {/* Error Message */}
      {error &&
        <div className="mt-4 text-red-600">
          {error}
        </div>}

      {/* Success Message */}
      {isSubmitted &&
        <div className="mt-4 text-green-600">
          Responses submitted successfully!
          <div>Assessment completed.</div>
        </div>}
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question5dV />
  </Suspense>;

export default SuspenseWrapper;
