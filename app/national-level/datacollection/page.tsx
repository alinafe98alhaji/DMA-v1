// "use client";
// import { useState } from 'react';

// // Define types for responses
// type ResponseValue = 'Yes' | 'Partially' | 'No';
// type Responses = {
//   [questionId: string]: {
//     [area: string]: ResponseValue;
//   };
// };

// // Questions data
// const questions = [
//   {
//     id: '1a',
//     title: '1.a. Are there national guidelines that specify how data should be collected across the sector?',
//     areas: [
//       'Urban Water Supply Sector Monitoring',
//       'Urban Sanitation Sector Monitoring',
//       'Rural Water Supply Sector Monitoring',
//       'Rural Sanitation Sector Monitoring',
//       'Finance',
//       'Regulation',
//       'Utility Operations',
//     ],
//     hasSubQuestion: true,
//     subQuestion: '1.a.i. Which organisation is mandated to develop and enforce these guidelines for data collection?',
//   },
//   {
//     id: '1b',
//     title: '1.b. Is there a process/procedure for ensuring that data is collected universally/inclusively across the country?',
//     areas: [
//       'Urban Water Supply Sector Monitoring',
//       'Urban Sanitation Sector Monitoring',
//       'Rural Water Supply Sector Monitoring',
//       'Rural Sanitation Sector Monitoring',
//       'Finance',
//       'Regulation',
//       'Utility Operations',
//     ],
//     hasSubQuestion: false,
//   },
//   {
//     id: '1c',
//     title: '1.c. Are there financial and technical resources allocated to ensure data collection continues smoothly over time across the country?',
//     areas: [
//       'Urban Water Supply Sector Monitoring',
//       'Urban Sanitation Sector Monitoring',
//       'Rural Water Supply Sector Monitoring',
//       'Rural Sanitation Sector Monitoring',
//       'Finance',
//       'Regulation',
//       'Utility Operations',
//     ],
//     hasSubQuestion: false,
//   },
//   {
//     id: '1d',
//     title: '1.d. Are there centrally developed standardized digital tools for collecting data?',
//     areas: [
//       'Urban Water Supply Sector Monitoring',
//       'Urban Sanitation Sector Monitoring',
//       'Rural Water Supply Sector Monitoring',
//       'Rural Sanitation Sector Monitoring',
//       'Finance',
//       'Regulation',
//       'Utility Operations',
//     ],
//     hasSubQuestion: true,
//     subQuestion: '1.d.i. Which organisation is mandated to develop and maintain digital tools for data collection?',
//   },
// ];

// export default function Survey() {
//   const [responses, setResponses] = useState<Responses>({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleResponseChange = (area: string, value: ResponseValue) => {
//     setResponses((prev) => ({
//       ...prev,
//       [currentQuestion.id]: {
//         ...prev[currentQuestion.id],
//         [area]: value,
//       },
//     }));
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       alert('Survey complete!');
//       console.log('Responses:', responses);
//     }
//   };

//   return (
//     <div>
//       <h1>Survey Tool</h1>

//       {/* Current Question */}
//       <div className="card">
//         <h3>{currentQuestion.title}</h3>

//         {/* Render areas */}
//         {currentQuestion.areas.map((area) => (
//           <div key={area}>
//             <h4>{area}</h4>
//             <label>
//               <input
//                 type="radio"
//                 name={`${currentQuestion.id}-${area}`}
//                 value="Yes"
//                 checked={responses[currentQuestion.id]?.[area] === 'Yes'}
//                 onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
//               />
//               Yes
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name={`${currentQuestion.id}-${area}`}
//                 value="Partially"
//                 checked={responses[currentQuestion.id]?.[area] === 'Partially'}
//                 onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
//               />
//               Partially
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name={`${currentQuestion.id}-${area}`}
//                 value="No"
//                 checked={responses[currentQuestion.id]?.[area] === 'No'}
//                 onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
//               />
//               No
//             </label>

//             {/* Sub-Question for specific area */}
//             {currentQuestion.hasSubQuestion &&
//               (responses[currentQuestion.id]?.[area] === 'Yes' ||
//                 responses[currentQuestion.id]?.[area] === 'Partially') && (
//                 <div style={{ marginLeft: '20px', marginTop: '10px' }}>
//                   <h5>{currentQuestion.subQuestion}</h5>
//                   <textarea
//                     placeholder={`Provide details for ${area}...`}
//                     style={{ width: '100%', height: '50px' }}
//                   />
//                 </div>
//               )}
//           </div>
//         ))}
//       </div>

//       {/* Navigation */}
//       <button onClick={handleNext}>Next</button>
//     </div>
//   );
// }

//-------------
//----------------
//---------------

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
//import router from "next/router";

// Define types for responses
type ResponseValue = "Yes" | "Partially" | "No";
type Responses = {
  [questionId: string]: {
    [area: string]: ResponseValue;
  };
};

// Questions data
const questions = [
  {
    id: "1a",
    title:
      "1.a. Are there national guidelines that specify how data should be collected?",
    areas: [
      "Urban Water Supply Sector Monitoring",
      "Urban Sanitation Sector Monitoring",
      "Rural Water Supply Sector Monitoring",
      "Rural Sanitation Sector Monitoring",
      "Finance",
      "Regulation",
      "Utility Operations",
    ],
    hasSubQuestion: true,
    subQuestion:
      "1.a.i. Which organisation is mandated to develop and enforce these guidelines for data collection?",
  },
  {
    id: "1b",
    title:
      "1.b. Is there a process for ensuring that data is collected universally/inclusively across the country?",
    areas: [
      "Urban Water Supply Sector Monitoring",
      "Urban Sanitation Sector Monitoring",
      "Rural Water Supply Sector Monitoring",
      "Rural Sanitation Sector Monitoring",
      "Finance",
      "Regulation",
      "Utility Operations",
    ],
    hasSubQuestion: false,
  },
  {
    id: "1c",
    title:
      "1.c. Is there a national plan to ensure the long term sustainability of the data collection process?",
    areas: [
      "Urban Water Supply Sector Monitoring",
      "Urban Sanitation Sector Monitoring",
      "Rural Water Supply Sector Monitoring",
      "Rural Sanitation Sector Monitoring",
      "Finance",
      "Regulation",
      "Utility Operations",
    ],
    hasSubQuestion: false,
  },
  {
    id: "1d",
    title: "1.d. Are there centrally developed standardized digital tools for collecting data?",
    areas: [
      "Urban Water Supply Sector Monitoring",
      "Urban Sanitation Sector Monitoring",
      "Rural Water Supply Sector Monitoring",
      "Rural Sanitation Sector Monitoring",
      "Finance",
      "Regulation",
      "Utility Operations",
    ],
    hasSubQuestion: true,
    subQuestion:
      "1.d.i. Which organisation is mandated to develop and maintain digital tools for data collection?",
  },
];

export default function Survey() {
  const [responses, setResponses] = useState<Responses>({});
  const [subResponses, setSubResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const router = useRouter();

  // Handle response selection
  const handleResponseChange = (area: string, value: ResponseValue) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        [area]: value,
      },
    }));
  };

  // Handle sub-question response
  const handleSubResponseChange = (area: string, value: string) => {
    setSubResponses((prev) => ({
      ...prev,
      [`${currentQuestion.id}-${area}`]: value,
    }));
  };

  // Handle next button click with validation
  const handleNext = () => {
    const responsesForCurrentQuestion = responses[currentQuestion.id] || {};
    const allAreasResponded = currentQuestion.areas.every((area) => responsesForCurrentQuestion[area]);

    if (!allAreasResponded) {
      setError("Please respond to all areas before proceeding.");
      return;
    }

    if (currentQuestion.hasSubQuestion) {
      const allSubResponsesFilled = currentQuestion.areas.every((area) => {
        const response = responsesForCurrentQuestion[area];
        if (response === "Yes" || response === "Partially") {
          return subResponses[`${currentQuestion.id}-${area}`]?.trim();
        }
        return true;
      });

      if (!allSubResponsesFilled) {
        setError("Please provide details for all required sub-questions.");
        return;
      }
    }

    setError(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
       console.log("Responses:", responses);
      console.log("Sub-Responses:", subResponses);
    
        // Navigate to the next survey component
        router.push("/national-level/dataownershipandmanagement"); // Change to the next survey page route
      
  
     }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Data Collection</h1>

      {/* Error Message */}
      {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}

      {/* Current Question */}
      <div className="border p-4 rounded-md shadow-sm bg-gray-50">
        <h3 className="text-lg text-gray-900 font-semibold mb-3">{currentQuestion.title}</h3>

        {/* Render areas */}
        {currentQuestion.areas.map((area) => (
          <div key={area} className="mb-4">
            <h4 className="font-medium text-gray-900">{area}</h4>
            <div className="flex text-gray-900 gap-4 mt-2">
              {["Yes", "Partially", "No"].map((option) => (
                <label key={option} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`${currentQuestion.id}-${area}`}
                    value={option}
                    checked={responses[currentQuestion.id]?.[area] === option}
                    onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
                  />
                  {option}
                </label>
              ))}
            </div>

            {/* Sub-Question for specific area */}
            {currentQuestion.hasSubQuestion &&
              (responses[currentQuestion.id]?.[area] === "Yes" ||
                responses[currentQuestion.id]?.[area] === "Partially") && (
                <div className="mt-2 ml-4">
                  <h5 className="text-sm text-gray-900 font-semibold">{currentQuestion.subQuestion}</h5>
                  <textarea
                    className="text-gray-900 border rounded w-full p-2 mt-1"
                    placeholder={`Provide details for ${area}...`}
                    value={subResponses[`${currentQuestion.id}-${area}`] || ""}
                    onChange={(e) => handleSubResponseChange(area, e.target.value)}
                  />
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        onClick={handleNext}
      >
        {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
}
