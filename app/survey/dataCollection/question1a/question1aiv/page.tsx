// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const Question1aiv = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const areasFor1aiv: string[] = JSON.parse(
//     searchParams.get("areasFor1aiv") || "[]"
//   );

//   const areasFor1av: string[] = JSON.parse(
//     searchParams.get("areasFor1av") || "[]"
//   );

//   const wordOptions = [
//     "Poorly defined and inconsistently used, causing fragmented data practices.",
//     "Complexity of Standards: The standards are too complex or technical",
//     "Partly aligned with organisational strategies, increasing use, with some inconsistencies remaining.",
//     "Well-defined and widely used, aligned with organisation strategies, with minor discrepancies.",
//     "Fully developed, universally used, enabling seamless and consistent data practices across all organisations."
//   ];

//   // Define scoring for each option
//   const scoringMap: Record<string, number> = {
//     "Poorly defined and inconsistently used, causing fragmented data practices.": 0.2,
//     "Complexity of Standards: The standards are too complex or technical": 0.4,
//     "Partly aligned with organisational strategies, increasing use, with some inconsistencies remaining.": 0.6,
//     "Well-defined and widely used, aligned with organisation strategies, with minor discrepancies.": 0.8,
//     "Fully developed, universally used, enabling seamless and consistent data practices across all organisations.": 1
//   };

//   const [responses, setResponses] = useState<Record<string, string>>({});
//   const [error, setError] = useState<string>("");

//   const handleOptionChange = (area: string, value: string) => {
//     setResponses(prev => ({ ...prev, [area]: value }));

//     // Clear error message when user selects an option
//     if (error) {
//       setError("");
//     }
//   };

//   const validateResponses = () => {
//     // Check if all areas have a response selected
//     for (const area of areasFor1aiv) {
//       if (!responses[area]) {
//         return false; // If any area is unanswered, return false
//       }
//     }
//     return true; // All areas have been answered
//   };

//   const handleNext = async () => {
//     if (!validateResponses()) {
//       setError("Please answer all areas before proceeding.");
//       return; // Stop navigation if validation fails
//     }

//     // Retrieve user_id from sessionStorage
//     const userId_ses = sessionStorage.getItem("user_id");

//     if (!userId_ses) {
//       alert("User ID is missing. Please return to the basic details page.");
//       return;
//     }

//     // Prepare response object with scores
//     const responseObject = {
//       userId: userId_ses,
//       questionID: "1a.iv",
//       responses: Object.entries(responses).map(([area, response]) => ({
//         area,
//         response,
//         score: scoringMap[response] || 0 // Apply the scoring logic
//       }))
//     };
//     console.log("1a.iv Follow-up responses:", responseObject);

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
//         const queryParams = new URLSearchParams();
//         queryParams.set("areasFor1av", JSON.stringify(areasFor1av));
//         router.push(
//           `/survey/dataCollection/question1a/question1av?${queryParams.toString()}`
//         );
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
//           <h1 className="mb-4 text-lg font-bold">Organisational Level</h1>
//           <li>
//             This question examines why/why not your data collection processes
//             align with the standards
//           </li>
//         </ul>
//       </div>
//       <h1 className="text-xl font-bold mb-6">
//         1.a.iv: How effective are the guidelines in terms of their development,
//         adoption, and suitability?
//       </h1>

//       {/* Tabular layout */}
//       <div className="overflow-auto">
//         <table className="min-w-full border-collapse border border-gray-200">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 p-2 text-left">Areas</th>
//               {wordOptions.map(option =>
//                 <th
//                   key={option}
//                   className="border border-gray-300 p-2 text-center"
//                 >
//                   {option}
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {areasFor1aiv.map(area =>
//               <tr key={area} className="hover:bg-gray-100">
//                 <td className="border border-gray-300 p-2 font-semibold">
//                   {area}
//                 </td>
//                 {wordOptions.map(option =>
//                   <td
//                     key={option}
//                     className="border border-gray-300 text-center"
//                   >
//                     <input
//                       type="radio"
//                       name={area}
//                       value={option}
//                       checked={responses[area] === option}
//                       onChange={() => handleOptionChange(area, option)}
//                     />
//                   </td>
//                 )}
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Error message */}
//       {error &&
//         <p className="text-red-500">
//           {error}
//         </p>}

//       <button
//         onClick={handleNext}
//         className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Question1aiv;

"use client"; // This ensures the component is client-side only.

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Question1aiv = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const areasFor1aiv: string[] = JSON.parse(
    searchParams.get("areasFor1aiv") || "[]"
  );

  const areasFor1av: string[] = JSON.parse(
    searchParams.get("areasFor1av") || "[]"
  );

  const wordOptions = [
    "Poorly defined and inconsistently used, causing fragmented data practices.",
    "Complexity of Standards: The standards are too complex or technical",
    "Partly aligned with organisational strategies, increasing use, with some inconsistencies remaining.",
    "Well-defined and widely used, aligned with organisation strategies, with minor discrepancies.",
    "Fully developed, universally used, enabling seamless and consistent data practices across all organisations."
  ];

  const scoringMap: Record<string, number> = {
    "Poorly defined and inconsistently used, causing fragmented data practices.": 0.2,
    "Complexity of Standards: The standards are too complex or technical": 0.4,
    "Partly aligned with organisational strategies, increasing use, with some inconsistencies remaining.": 0.6,
    "Well-defined and widely used, aligned with organisation strategies, with minor discrepancies.": 0.8,
    "Fully developed, universally used, enabling seamless and consistent data practices across all organisations.": 1
  };

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from sessionStorage only on client-side
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleOptionChange = (area: string, value: string) => {
    setResponses(prev => ({ ...prev, [area]: value }));

    // Clear error message when user selects an option
    if (error) {
      setError("");
    }
  };

  const validateResponses = () => {
    // Check if all areas have a response selected
    for (const area of areasFor1aiv) {
      if (!responses[area]) {
        return false; // If any area is unanswered, return false
      }
    }
    return true; // All areas have been answered
  };

  const handleNext = async () => {
    if (!validateResponses()) {
      setError("Please answer all areas before proceeding.");
      return; // Stop navigation if validation fails
    }
    const completionId = sessionStorage.getItem("completionId");
    if (!userId || !completionId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Prepare response object with scores
    const responseObject = {
      userId,
      completionId,
      questionID: "1a.iv",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response,
        score: scoringMap[response] || 0 // Apply the scoring logic
      }))
    };
    console.log("1a.iv Follow-up responses:", responseObject);

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
        const queryParams = new URLSearchParams();
        queryParams.set("areasFor1av", JSON.stringify(areasFor1av));
        router.push(
          `/survey/dataCollection/question1a/question1av?${queryParams.toString()}`
        );
      })
      .catch(err => {
        console.error("Error saving responses:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Data collection</h1>

      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h1 className="text-lg text-gray-900 font-bold mb-4">
          1.a.iv: How effective are the guidelines in terms of their
          development, adoption, and suitability?
        </h1>
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <li>
            This question examines why/why not your data collection processes
            align with the standards
          </li>
        </ul>
      </div>

      {/* Tabular layout */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Areas</th>
              {wordOptions.map(option =>
                <th
                  key={option}
                  className="border border-gray-300 p-2 text-center"
                >
                  {option}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {areasFor1aiv.map(area =>
              <tr key={area}>
                <td className="border border-gray-300 p-2 font-semibold">
                  {area}
                </td>
                {wordOptions.map(option =>
                  <td
                    key={option}
                    className="hover:bg-gray-100 border border-gray-300 text-center"
                  >
                    <input
                      type="radio"
                      name={area}
                      value={option}
                      checked={responses[area] === option}
                      onChange={() => handleOptionChange(area, option)}
                    />
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error message */}
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

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question1aiv />
  </Suspense>;

export default SuspenseWrapper;
