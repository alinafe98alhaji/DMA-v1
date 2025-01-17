// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// export const dynamic = "force-dynamic";

// const Question1div = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Parse areas passed from 1.d.iii (for this page)
//   const areasFor1div: string[] = JSON.parse(
//     searchParams.get("areasFor1div") || "[]"
//   );

//   // Parse areas that were answered "No" from 1.d.ii (for 1.d.v)
//   // const areasFor1dv: string[] = JSON.parse(
//   //   searchParams.get("areasFor1dv") || "[]"
//   // );

//   // Define word options for the radio buttons
//   const wordOptions = [
//     "Centralised tools are insufficient, lacking critical features and integration with systems, leading to inefficient data collection.",
//     "Centrally developed tools have basic digital features but don't fully cover all organisational needs or integrate smoothly with other systems.",
//     "Digital tools are improving and starting to meet our broader needs, though integration with existing systems is not yet seamless.",
//     "The tools are well-suited for most tasks and show good integration, but there's room for better customisation and user experience improvements.",
//     "Tools are fully optimised, covering all specific needs of our organisation, and integrate flawlessly with our systems, enhancing overall productivity and data quality."
//   ];

//   // Define the scores for each response option
//   const scores = [0.2, 0.4, 0.6, 0.8, 1];

//   // State to store responses
//   const [responses, setResponses] = useState<Record<string, string>>({});
//   const [scoresMap, setScoresMap] = useState<Record<string, number>>({});
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   // Handle option change for each area
//   const handleOptionChange = (area: string, value: string, score: number) => {
//     // Remove error message when user starts selecting an option
//     if (!responses[area]) {
//       setErrorMessage("");
//     }

//     setResponses(prev => ({ ...prev, [area]: value }));
//     setScoresMap(prev => ({ ...prev, [area]: score }));
//   };

//   // Validation for the Next button
//   const handleNext = async () => {
//     // Ensure all areas have been answered
//     const allAnswered = areasFor1div.every(
//       (area: string) => responses[area] // Make sure 'area' is of type string
//     );
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

//     // Log responses with questionID and scores
//     const responseObject = {
//       userId: userId_ses,
//       questionID: "1d.iv", // Adding questionID
//       responses: Object.entries(responses).map(([area, response]) => ({
//         area,
//         response,
//         score: scoresMap[area] // Include the score for each area
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

//         // Redirect to the next page with the areas answered "No" in 1.d.ii
//         // const queryParams = new URLSearchParams();
//         // queryParams.set("areasFor1dv", JSON.stringify(areasFor1dv));

//         // Redirect to 1.d.v
//         router.push(`/survey/dataCollection/question1d/question1dv`);
//       })
//       .catch(err => {
//         console.error("Error saving responses:", err);
//       });
//   };

//   return (
//     <div className="p-6 survey-container">
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
//             This question examines why/why not your organisation utilises the
//             provided digital tools for collecting data.
//           </li>
//         </ul>
//       </div>

//       <h1 className="text-xl font-bold mb-6">
//         1.d.iv: How well suited are these tools for your needs as a data
//         collector?
//       </h1>

//       {/* Table layout */}
//       <div className="overflow-auto">
//         <table className="min-w-full border-collapse border border-gray-200">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 p-2 text-left">Area</th>
//               {wordOptions.map((option, index) =>
//                 <th
//                   key={index}
//                   className="border border-gray-300 p-2 text-center"
//                 >
//                   {option}
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {areasFor1div.map((area: string) =>
//               <tr key={area} className="hover:bg-gray-100">
//                 <td className="border border-gray-300 p-2 font-semibold">
//                   {area}
//                 </td>
//                 {wordOptions.map((option, index) =>
//                   <td
//                     key={index}
//                     className="border border-gray-300 text-center"
//                   >
//                     <label>
//                       <input
//                         type="radio"
//                         name={area}
//                         value={option}
//                         checked={responses[area] === option}
//                         onChange={() =>
//                           handleOptionChange(area, option, scores[index])}
//                       />
//                     </label>
//                   </td>
//                 )}
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

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

// export default Question1div;

"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const Question1div = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse areas passed from 1.d.iii (for this page)
  const areasFor1div: string[] = JSON.parse(
    searchParams.get("areasFor1div") || "[]"
  );

  // Define word options for the radio buttons
  const wordOptions = [
    "Centralised tools are insufficient, lacking critical features and integration with systems, leading to inefficient data collection.",
    "Centrally developed tools have basic digital features but don't fully cover all organisational needs or integrate smoothly with other systems.",
    "Digital tools are improving and starting to meet our broader needs, though integration with existing systems is not yet seamless.",
    "The tools are well-suited for most tasks and show good integration, but there's room for better customisation and user experience improvements.",
    "Tools are fully optimised, covering all specific needs of our organisation, and integrate flawlessly with our systems, enhancing overall productivity and data quality."
  ];

  // Define the scores for each response option
  const scores = [0.2, 0.4, 0.6, 0.8, 1];

  // State to store responses
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [scoresMap, setScoresMap] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle option change for each area
  const handleOptionChange = (area: string, value: string, score: number) => {
    // Remove error message when user starts selecting an option
    if (!responses[area]) {
      setErrorMessage("");
    }

    setResponses(prev => ({ ...prev, [area]: value }));
    setScoresMap(prev => ({ ...prev, [area]: score }));
  };

  // Validation for the Next button
  const handleNext = async () => {
    // Ensure all areas have been answered
    const allAnswered = areasFor1div.every(
      (area: string) => responses[area] // Make sure 'area' is of type string
    );
    if (!allAnswered) {
      setErrorMessage("Please select an option for every area.");
      return;
    }

    // If all are answered, clear any previous error message and proceed
    setErrorMessage("");

    // Retrieve user_id from sessionStorage
    const userId_ses = sessionStorage.getItem("user_id");

    if (!userId_ses) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Log responses with questionID and scores
    const responseObject = {
      userId: userId_ses,
      questionID: "1d.iv", // Adding questionID
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: scoresMap[area] // Include the score for each area
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
        router.push(`/survey/dataCollection/question1d/question1dv`);
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6 survey-container">
      <h1 className="mb-4 text-lg font-bold">Data collection</h1>
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-lg text-gray-900 font-bold mb-6">
          1.d.iv: How well suited are these tools for your needs as a data
          collector?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question examines why/why not your organisation utilises the
            provided digital tools for collecting data.
          </li>
        </ul>
      </div>

      {/* Table layout */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Area</th>
              {wordOptions.map((option, index) =>
                <th
                  key={index}
                  className="border border-gray-300 p-2 text-center"
                >
                  {option}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {areasFor1div.map((area: string) =>
              <tr key={area}>
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                {wordOptions.map((option, index) =>
                  <td
                    key={index}
                    className="hover:bg-blue-100 border border-gray-300 text-center"
                  >
                    <label>
                      <input
                        type="radio"
                        name={area}
                        value={option}
                        checked={responses[area] === option}
                        onChange={() =>
                          handleOptionChange(area, option, scores[index])}
                      />
                    </label>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {errorMessage &&
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>}

      {/* Next Button */}
      <div className="navigation-buttons mt-4">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question1div />
  </Suspense>;

export default SuspenseWrapper;
