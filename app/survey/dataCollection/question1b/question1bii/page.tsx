// "use client";

// import React, { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// export const dynamic = "force-dynamic";

// const Question1bii = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Parse areas passed from 1.b.i
//   const areasFor1bii: string[] = JSON.parse(
//     searchParams.get("pageData") || "[]"
//   );

//   // Define 5-option radio values and scores
//   const options = [
//     {
//       text: "The process is ineffective and unresourced, leading to significant gaps in data collection coverage.",
//       score: 0.2
//     },
//     {
//       text: "Initial processes are complex, partially resourced and inconsistently applied, resulting in uneven data collection.",
//       score: 0.4
//     },
//     {
//       text: "Processes are improving, becoming more standard and slightly more inclusive, but data collection is still not universal.",
//       score: 0.6
//     },
//     {
//       text: "Well-implemented processes ensure broad coverage, with only some small oversights.",
//       score: 0.8
//     },
//     {
//       text: "The process is fully optimised and ensures complete, universal data collection.",
//       score: 1.0
//     }
//   ];

//   // State to track responses
//   const [responses, setResponses] = useState<{ [area: string]: { text: string; score: number } }>({});
//   const [error, setError] = useState<string>(""); // Error state for validation

//   // Handle selection
//   const handleSelection = (area: string, option: { text: string; score: number }) => {
//     setResponses(prev => ({ ...prev, [area]: option }));
//     // Clear error message if any option is selected
//     if (error) {
//       setError("");
//     }
//   };

//   // Handle submission
//   const handleSubmit = async () => {
//     // Check if all areas have been answered
//     if (Object.keys(responses).length !== areasFor1bii.length) {
//       setError("Please respond to all areas before submitting.");
//       return; // Stop submission if any area is unanswered
//     }

//     // Retrieve user_id from sessionStorage
//     const userId_ses = sessionStorage.getItem("user_id");

//     if (!userId_ses) {
//       alert("User ID is missing. Please return to the basic details page.");
//       return;
//     }

//     // Log responses with questionID
//     const responseObject = {
//       userId: userId_ses,
//       questionID: "1b.ii", // Adding questionID
//       responses: Object.entries(responses).map(([area, { text, score }]) => ({
//         area,
//         response: text,
//         score
//       }))
//     };
//     console.log("1b.ii Responses with Scores:", responseObject); // Log for debugging

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
//         router.push("/survey/dataCollection/question1c"); // Replace "/nextPage" with the actual next route
//       })
//       .catch(err => {
//         console.error("Error saving responses:", err);
//       });
//   };

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
//             This question examines why/why not your organisation follows the
//             guidelines for inclusive data collection.
//           </li>
//         </ul>
//       </div>
//       <h1 className="mb-4 text-xl font-bold">
//         1.b.ii: How effective is this process at ensuring that data is collected
//         universally and inclusively?
//       </h1>
//       <p className="mb-6" />

//       {/* Table */}
//       <table className="w-full border-collapse border border-gray-300">
//         {/* Header Row */}
//         <thead>
//           <tr>
//             <th className="border border-gray-300 p-2 text-left">Area</th>
//             {options.map(option =>
//               <th
//                 key={option.text}
//                 className="border border-gray-300 p-2 text-center"
//               >
//                 {option.text}
//               </th>
//             )}
//           </tr>
//         </thead>

//         {/* Body Rows */}
//         <tbody>
//           {areasFor1bii.map(area =>
//             <tr key={area} className="hover:bg-gray-100">
//               {/* Area Name */}
//               <td className="border border-gray-300 p-2">
//                 {area}
//               </td>

//               {/* Radio Buttons for Each Option */}
//               {options.map(option =>
//                 <td
//                   key={option.text}
//                   className="border border-gray-300 p-2 text-center"
//                 >
//                   <input
//                     type="radio"
//                     name={area}
//                     value={option.text}
//                     onChange={() => handleSelection(area, option)}
//                     checked={responses[area]?.text === option.text}
//                   />
//                 </td>
//               )}
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Error Message */}
//       {error &&
//         <p className="text-red-500">
//           {error}
//         </p>}

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default Question1bii;

"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question1bii = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 1.b.i
  const areasFor1bii: string[] = JSON.parse(
    searchParams.get("pageData") || "[]"
  );

  // Define 5-option radio values and scores
  const options = [
    {
      text: "The process is ineffective and unresourced, leading to significant gaps in data collection coverage.",
      score: 0.2
    },
    {
      text: "Initial processes are complex, partially resourced and inconsistently applied, resulting in uneven data collection.",
      score: 0.4
    },
    {
      text: "Processes are improving, becoming more standard and slightly more inclusive, but data collection is still not universal.",
      score: 0.6
    },
    {
      text: "Well-implemented processes ensure broad coverage, with only some small oversights.",
      score: 0.8
    },
    {
      text: "The process is fully optimised and ensures complete, universal data collection.",
      score: 1.0
    }
  ];

  // State to track responses
  const [responses, setResponses] = useState<{ [area: string]: { text: string; score: number } }>({});
  const [error, setError] = useState<string>(""); // Error state for validation

  // Handle selection
  const handleSelection = (area: string, option: { text: string; score: number }) => {
    setResponses(prev => ({ ...prev, [area]: option }));
    // Clear error message if any option is selected
    if (error) {
      setError("");
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    // Check if all areas have been answered
    if (Object.keys(responses).length !== areasFor1bii.length) {
      setError("Please respond to all areas before submitting.");
      return; // Stop submission if any area is unanswered
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
      questionID: "1b.ii", // Adding questionID
      responses: Object.entries(responses).map(([area, { text, score }]) => ({
        area,
        response: text,
        score
      }))
    };
    console.log("1b.ii Responses with Scores:", responseObject); // Log for debugging

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
        router.push("/survey/dataCollection/question1c"); // Replace "/nextPage" with the actual next route
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
            Data Collection Assessment Organisational Level
          </h1>
          <li>
            This question examines why/why not your organisation follows the
            guidelines for inclusive data collection.
          </li>
        </ul>
      </div>
      <h1 className="mb-4 text-xl font-bold">
        1.b.ii: How effective is this process at ensuring that data is collected
        universally and inclusively?
      </h1>
      <p className="mb-6" />

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        {/* Header Row */}
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Area</th>
            {options.map(option =>
              <th
                key={option.text}
                className="border border-gray-300 p-2 text-center"
              >
                {option.text}
              </th>
            )}
          </tr>
        </thead>

        {/* Body Rows */}
        <tbody>
          {areasFor1bii.map(area =>
            <tr key={area} className="hover:bg-gray-100">
              {/* Area Name */}
              <td className="border border-gray-300 p-2">
                {area}
              </td>

              {/* Radio Buttons for Each Option */}
              {options.map(option =>
                <td
                  key={option.text}
                  className="border border-gray-300 p-2 text-center"
                >
                  <input
                    type="radio"
                    name={area}
                    value={option.text}
                    onChange={() => handleSelection(area, option)}
                    checked={responses[area]?.text === option.text}
                  />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      {/* Error Message */}
      {error &&
        <p className="text-red-500">
          {error}
        </p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Question1bii />
  </Suspense>
);

export default SuspenseWrapper;
