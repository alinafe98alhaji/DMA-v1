// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// export const dynamic = "force-dynamic";

// const Question1aFollowUp = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
//   const [areas, setAreas] = useState<string[]>([]);
//   const [responses, setResponses] = useState<Record<string, string>>({});
//   const [errors, setErrors] = useState<Record<string, boolean>>({}); // Track validation errors

//   // Parse the areas query parameter
//   useEffect(
//     () => {
//       if (areasParam) {
//         try {
//           const decodedAreas = decodeURIComponent(areasParam).split("|");
//           setAreas(decodedAreas);
//         } catch (error) {
//           console.error("Error parsing areas:", error);
//         }
//       }
//     },
//     [areasParam]
//   );

//   // Handle input change
//   const handleInputChange = (area: string, value: string) => {
//     setResponses(prev => ({
//       ...prev,
//       [area]: value
//     }));
//     setErrors(prev => ({
//       ...prev,
//       [area]: false // Clear error when user enters a value
//     }));
//   };

//   // Handle submission with validation
//   const handleSubmit = async () => {
//     const newErrors: Record<string, boolean> = {};
//     let hasErrors = false;

//     // Check for empty responses
//     areas.forEach(area => {
//       if (!responses[area]) {
//         newErrors[area] = true;
//         hasErrors = true;
//       }
//     });

//     setErrors(newErrors);

//     if (hasErrors) {
//       alert("Please provide details for all areas before proceeding.");
//       return;
//     }

//     // Retrieve user_id from sessionStorage
//     const userId = sessionStorage.getItem("user_id");

//     if (!userId) {
//       alert("User ID is missing. Please return to the basic details page.");
//       return;
//     }

//     // Prepare response object
//     const responseObject = {
//       userId, // Include user_id
//       questionID: "1a.i",
//       responses: Object.entries(responses).map(([area, response]) => ({
//         area,
//         response
//       }))
//     };

//     try {
//       // Save responses via API
//       const res = await fetch("/api/nationalLevel", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(responseObject)
//       });

//       if (!res.ok) {
//         throw new Error("Failed to save responses");
//       }

//       // Navigate to the next question
//       router.push(`/survey/dataCollection/question1a/question1aii`);
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
//           <h1 className="mb-4 text-lg font-bold">National Level</h1>
//           <li>
//             Identify the governmental or regulatory body responsible for setting
//             data collection standards. This could be a national authority, a
//             regulatory agency, or a sector-specific organization.
//           </li>
//         </ul>
//       </div>
//       <h1>
//         1.a.i Which organization is mandated to develop and enforce these
//         guidelines for data collection?
//       </h1>
//       <p>Please provide additional details below:</p>
//       {areas.length > 0
//         ? <form>
//             {areas.map(area =>
//               <div
//                 key={area}
//                 className={`mb-4 p-4 rounded-lg ${errors[area]
//                   ? "border-red-500 border"
//                   : "border-gray-300 border"}`}
//               >
//                 <h3 className="font-semibold">
//                   {area}
//                 </h3>
//                 <input
//                   type="text"
//                   placeholder={`Enter details for ${area}`}
//                   value={responses[area] || ""}
//                   onChange={e => handleInputChange(area, e.target.value)}
//                   className="w-full p-2 border border-gray-400 rounded"
//                 />
//                 {errors[area] &&
//                   <p className="text-red-500 text-sm mt-2">
//                     This field is required.
//                   </p>}
//               </div>
//             )}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Next
//             </button>
//           </form>
//         : <p>No areas to display.</p>}
//     </div>
//   );
// };

// export default Question1aFollowUp;

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useState, useEffect } from "react";
export const dynamic = "force-dynamic";

const Question1aFollowUp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const areasParam = searchParams.get("areas"); // Get the 'areas' query parameter
  const [areas, setAreas] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({}); // Track validation errors

  // Parse the areas query parameter
  useEffect(
    () => {
      if (areasParam) {
        try {
          const decodedAreas = decodeURIComponent(areasParam).split("|");
          setAreas(decodedAreas);
        } catch (error) {
          console.error("Error parsing areas:", error);
        }
      }
    },
    [areasParam]
  );

  // Handle input change
  const handleInputChange = (area: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [area]: value
    }));
    setErrors(prev => ({
      ...prev,
      [area]: false // Clear error when user enters a value
    }));
  };

  // Handle submission with validation
  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    let hasErrors = false;

    // Check for empty responses
    areas.forEach(area => {
      if (!responses[area]) {
        newErrors[area] = true;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      alert("Please provide details for all areas before proceeding.");
      return;
    }

    // Retrieve user_id from sessionStorage
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
      alert("User ID is missing. Please return to the basic details page.");
      return;
    }

    // Prepare response object
    const responseObject = {
      userId, // Include user_id
      questionID: "1a.i",
      responses: Object.entries(responses).map(([area, response]) => ({
        area,
        response
      }))
    };

    try {
      // Save responses via API
      const res = await fetch("/api/nationalLevel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(responseObject)
      });

      if (!res.ok) {
        throw new Error("Failed to save responses");
      }

      // Navigate to the next question
      router.push(`/survey/dataCollection/question1a/question1aii`);
    } catch (error) {
      console.error("Error saving follow-up responses:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">National Level</h1>
          <li>
            Identify the governmental or regulatory body responsible for setting
            data collection standards. This could be a national authority, a
            regulatory agency, or a sector-specific organization.
          </li>
        </ul>
      </div>
      <h1>
        1.a.i Which organization is mandated to develop and enforce these
        guidelines for data collection?
      </h1>
      <p>Please provide additional details below:</p>
      {areas.length > 0
        ? <form>
            {areas.map(area =>
              <div
                key={area}
                className={`mb-4 p-4 rounded-lg ${errors[area]
                  ? "border-red-500 border"
                  : "border-gray-300 border"}`}
              >
                <h3 className="font-semibold">
                  {area}
                </h3>
                <input
                  type="text"
                  placeholder={`Enter details for ${area}`}
                  value={responses[area] || ""}
                  onChange={e => handleInputChange(area, e.target.value)}
                  className="w-full p-2 border border-gray-400 rounded"
                />
                {errors[area] &&
                  <p className="text-red-500 text-sm mt-2">
                    This field is required.
                  </p>}
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </form>
        : <p>No areas to display.</p>}
    </div>
  );
};

// Suspense wrapper component
const SuspenseWrapper = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Question1aFollowUp />
  </Suspense>;

export default SuspenseWrapper;
