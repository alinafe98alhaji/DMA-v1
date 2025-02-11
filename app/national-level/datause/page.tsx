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
//     id: '5a',
//     title: '5.a. Are there centralised systems/ platforms for sector data analysis, visualisation and reporting?',
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
//     subQuestion: '5.a.i. Which organisation is mandated to develop and maintain platforms for data analysis, visualisation and reporting?',
//   },
//   {
//     id: '5b',
//     title: '5.b. Are there incentives or mechanisms to promote data-driven decision making?',
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
//     subQuestion: '5.b.i. Which organisation is mandated to coordinate incentives to promote data-driven decision making?',
//   },
//   {
//     id: '5c',
//     title: '5.c. Are there established, standard, sector-wide KPIs?',
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
//     subQuestion: '5.c.i. Which organisation is mandated to develop and maintain standard sector-wide KPIs?',
//   },
//   {
//     id: '5d',
//     title: '5.d. Is there a formalised approach to training and capacity development for data-related aspects in the WSS sector?',
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
//     subQuestion: '5.d.i. Which organisation is mandated to develop and maintain these training and capacity development programmes?',
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
//     <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//       <h1 style={{ textAlign: 'center' }}>Survey Tool</h1>

//       {/* Current Question */}
//       <div className="card" style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
//         <h3>{currentQuestion.title}</h3>

//         {/* Render areas */}
//         {currentQuestion.areas.map((area) => (
//           <div key={area} style={{ margin: '15px 0' }}>
//             <h4 style={{ marginBottom: '10px' }}>{area}</h4>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <label>
//                 <input
//                   type="radio"
//                   name={`${currentQuestion.id}-${area}`}
//                   value="Yes"
//                   checked={responses[currentQuestion.id]?.[area] === 'Yes'}
//                   onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
//                 />
//                 Yes
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name={`${currentQuestion.id}-${area}`}
//                   value="Partially"
//                   checked={responses[currentQuestion.id]?.[area] === 'Partially'}
//                   onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
//                 />
//                 Partially
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name={`${currentQuestion.id}-${area}`}
//                   value="No"
//                   checked={responses[currentQuestion.id]?.[area] === 'No'}
//                   onChange={(e) => handleResponseChange(area, e.target.value as ResponseValue)}
//                 />
//                 No
//               </label>
//             </div>

//             {/* Sub-Question for specific area */}
//             {currentQuestion.hasSubQuestion &&
//               (responses[currentQuestion.id]?.[area] === 'Yes' ||
//                 responses[currentQuestion.id]?.[area] === 'Partially') && (
//                 <div style={{ marginLeft: '20px', marginTop: '10px' }}>
//                   <h5 style={{ fontStyle: 'italic' }}>{currentQuestion.subQuestion}</h5>
//                   <textarea
//                     placeholder={`Provide details for ${area}...`}
//                     style={{
//                       width: '100%',
//                       height: '50px',
//                       marginTop: '5px',
//                       padding: '5px',
//                       border: '1px solid #ccc',
//                       borderRadius: '4px',
//                     }}
//                   />
//                 </div>
//               )}
//           </div>
//         ))}
//       </div>

//       {/* Navigation */}
//       <button
//         onClick={handleNext}
//         style={{
//           display: 'block',
//           margin: '0 auto',
//           padding: '10px 20px',
//           backgroundColor: '#007BFF',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//         }}
//       >
//         Next
//       </button>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import "../national-level/styles/styles.css";

type ResponseValue = "Yes" | "Partially" | "No";
type Responses = {
  [questionId: string]: {
    [area: string]: ResponseValue;
  };
};

const questions = [
  {
    id: "5a",
    title: "5.a. Are there centrally managed, accessible platforms for data analysis and visualisation?",
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
      "5.a.i. Which organisation is mandated to develop and maintain platforms for data analysis and visualisation?",
  },
  {
    id: "5b",
    title: "5.b. Are there incentives to promote data-drive decision making?",
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
      "5.b.i. Which organisation is mandated to coordinate incentives to promote data-driven decision making?",
  },
  {
    id: "5c",
    title: "5.c. Are there established, standard, sector-wide KPIs?",
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
      "5.c.i. Which organisation is mandated to develop and maintain standard sector wide KPIs?",
  },
  {
    id: "5d",
    title:
      "5.d. Is there a formalised holistic approach to training and capacity building for data-related aspects in the WSS sector?",
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
      "5.d.i. Which organisation is mandated to develop and maintain these training and capacity building programmes?",
  },
];

export default function Survey() {
  const [responses, setResponses] = useState<Responses>({});
  const [subResponses, setSubResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleResponseChange = (area: string, value: ResponseValue) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        [area]: value,
      },
    }));
  };

  const handleSubResponseChange = (area: string, value: string) => {
    setSubResponses((prev) => ({
      ...prev,
      [`${currentQuestion.id}-${area}`]: value,
    }));
  };

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
      alert("Survey complete!");
      console.log("Responses:", responses);
      console.log("Sub-Responses:", subResponses);
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h1>Data Use</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="survey-card">
        <h2 className="survey-title">{currentQuestion.title}</h2>

        {currentQuestion.areas.map((area) => (
          <div className="survey-area" key={area}>
            <h4>{area}</h4>
            <div className="survey-options">
              {["Yes", "Partially", "No"].map((value) => (
                <label className="survey-radio" key={value}>
                  <input
                    type="radio"
                    name={`${currentQuestion.id}-${area}`}
                    value={value}
                    checked={responses[currentQuestion.id]?.[area] === value}
                    onChange={() => handleResponseChange(area, value as ResponseValue)}
                  />
                  <span className="custom-radio"></span>
                  {value}
                </label>
              ))}
            </div>

            {currentQuestion.hasSubQuestion &&
              (responses[currentQuestion.id]?.[area] === "Yes" ||
                responses[currentQuestion.id]?.[area] === "Partially") && (
                <div className="survey-subquestion">
                  <h5>{currentQuestion.subQuestion}</h5>
                  <textarea
                    placeholder={`Provide details for ${area}...`}
                    className="survey-textarea"
                    value={subResponses[`${currentQuestion.id}-${area}`] || ""}
                    onChange={(e) => handleSubResponseChange(area, e.target.value)}
                  />
                </div>
              )}
          </div>
        ))}

        <div className="survey-navigation">
          <button className="next-button" onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
