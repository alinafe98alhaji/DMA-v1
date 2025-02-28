// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const Question1aiii = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Parse areas from the query string
//   const areasFor1aiii: string[] = JSON.parse(
//     searchParams.get("areasFor1aiii") || "[]"
//   );
//   const areasFor1av: string[] = JSON.parse(
//     searchParams.get("areasFor1av") || "[]"
//   );

//   // State to store responses and error
//   const [responses, setResponses] = useState<Record<string, string>>({});
//   const [error, setError] = useState<string>("");

//   // Map responses to scores
//   const responseScores: Record<string, number> = {
//     Yes: 1,
//     Partially: 0.5,
//     No: 0
//   };

//   // Handle option change
//   const handleOptionChange = (area: string, value: string) => {
//     setResponses(prev => ({ ...prev, [area]: value }));
//     if (error) setError(""); // Clear error when user selects a value
//   };

//   // Validate that all areas have responses
//   const validateResponses = () => {
//     for (const area of areasFor1aiii) {
//       if (!responses[area]) {
//         return false; // If any area has no response, validation fails
//       }
//     }
//     return true; // All areas have responses
//   };

//   // Handle "Next" button click
//   const handleNext = async () => {
//     if (!validateResponses()) {
//       setError("Please answer all questions before proceeding.");
//       return;
//     }

//     // Retrieve user_id from sessionStorage
//     const userId = sessionStorage.getItem("user_id");

//     if (!userId) {
//       alert("User ID is missing. Please return to the basic details page.");
//       return;
//     }

//     // Prepare the response object
//     const responseObject = {
//       userId, // Include user_id
//       questionID: "1a.iii",
//       responses: Object.entries(responses).map(([area, response]) => ({
//         area,
//         response,
//         score: responseScores[response] // Attach the score to the response
//       }))
//     };

//     try {
//       // Send responses to API
//       const res = await fetch("/api/saveResponses", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(responseObject)
//       });

//       if (!res.ok) {
//         throw new Error("Failed to save responses");
//       }

//       // Determine areas for the next steps
//       const areasFor1aiv = areasFor1aiii.filter(
//         area =>
//           responses[area] === "Yes" ||
//           responses[area] === "Partially" ||
//           responses[area] === "No"
//       );

//       // Navigate to the next question with updated areas
//       router.push(
//         `/survey/dataCollection/question1a/question1aiv?areasFor1aiv=${encodeURIComponent(
//           JSON.stringify(areasFor1aiv)
//         )}&areasFor1av=${encodeURIComponent(JSON.stringify(areasFor1av))}`
//       );
//     } catch (error) {
//       console.error("Error saving follow-up responses:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Guidance Instructions */}
//       <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
//         <h2 className="text-lg font-bold mb-4 text-blue-800">
//           Guidance Instructions
//         </h2>
//         <ul className="list-disc pl-6 text-black">
//           <h1 className="mb-4 text-lg font-bold">Organisational Level</h1>
//           <li>Do your data collection processes align with the standards?</li>
//         </ul>
//       </div>
//       <h1 className="text-xl font-bold mb-6">
//         1.a.iii: Does your organisation collect data in adherence to these
//         national guidelines?
//       </h1>
//       {areasFor1aiii.map((area: string) =>
//         <div key={area} className="mb-4">
//           <label className="block font-semibold mb-2">
//             {area}
//           </label>
//           <div className="flex gap-4">
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
//       {error &&
//         <p className="text-red-500">
//           {error}
//         </p>}{" "}
//       {/* Display error if validation fails */}
//       <button
//         onClick={handleNext}
//         className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Question1aiii;
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Question1aiii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const areasFor1aiii: string[] = JSON.parse(
    searchParams.get("areasFor1aiii") || "[]"
  );
  const areasFor1av: string[] = JSON.parse(
    searchParams.get("areasFor1av") || "[]"
  );

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  const responseScores: Record<string, number> = {
    Yes: 1,
    Partially: 0.5,
    No: 0
  };

  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));
    if (error) setError(""); // Clear error when user selects a value
  };

  const validateResponses = () => {
    for (const area of areasFor1aiii) {
      if (!responses[area]) {
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateResponses()) {
      setError("Please answer all questions before proceeding.");
      return;
    }

    const userId = sessionStorage.getItem("user_id");
    const completionId = sessionStorage.getItem("completionId");

    if (!userId || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    const responseObject = {
      userId,
      completionId,
      questionID: "1a.iii",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: responseScores[response]
      }))
    };

    try {
      const res = await fetch("/api/saveResponses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) {
        throw new Error("Failed to save responses");
      }

      const areasFor1aiv = areasFor1aiii.filter(
        area =>
          responses[area] === "Yes" ||
          responses[area] === "Partially" ||
          responses[area] === "No"
      );

      router.push(
        `/survey/dataCollection/question1a/question1aiv?areasFor1aiv=${encodeURIComponent(
          JSON.stringify(areasFor1aiv)
        )}&areasFor1av=${encodeURIComponent(JSON.stringify(areasFor1av))}`
      );
    } catch (error) {
      console.error("Error saving follow-up responses:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Data collection</h1>

      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-lg text-gray-900 font-bold mb-6">
          1.a.iii: Does your organisation collect data in adherence to these
          national guidelines?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>Do your data collection processes align with the standards?</li>
        </ul>
      </div>

      {areasFor1aiii.map((area: string) =>
        <div key={area} className="mb-4">
          <label className="block font-semibold mb-2">
            {area}
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                checked={responses[area] === "Yes"}
                onChange={() => handleOptionChange(area, "Yes")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                checked={responses[area] === "Partially"}
                onChange={() => handleOptionChange(area, "Partially")}
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                checked={responses[area] === "No"}
                onChange={() => handleOptionChange(area, "No")}
              />
              No
            </label>
          </div>
        </div>
      )}
      {error &&
        <p className="text-red-500">
          {error}
        </p>}
      <button
        onClick={handleNext}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

// Wrap the component with Suspense in the main render function
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question1aiii />
  </Suspense>;

export default SuspenseWrapper;
