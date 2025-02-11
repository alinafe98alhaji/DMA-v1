"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define types for responses
type ResponseValue = "Yes" | "Partially" | "No";
type Responses = {
  [questionId: string]: {
    [area: string]: ResponseValue;
  };
};

const questions = [
  {
    id: "4a",
    title: "4.a. Is there a centralised process for ongoing assessment of the quality of data?",
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
    subQuestion: "4.a.i. Which organisation is mandated to assess data quality?",
  },
  {
    id: "4b",
    title: "4.b. Are there centrally coordinated programs or initiatives for improving data quality?",
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
      "4.b.i. Which organisation is mandated to coordinate programs for data quality improvement?",
  },
];

export default function Survey() {
  const [responses, setResponses] = useState<Responses>({});
  const [subResponses, setSubResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const router = useRouter();

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
      alert("complete!");
      console.log("Responses:", responses);
      console.log("Sub-Responses:", subResponses);
      router.push("/datause");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Data Quality</h1>

      {/* Error Message */}
      {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}

      {/* Current Question */}
      <div className="border p-4 rounded-md shadow-sm bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">{currentQuestion.title}</h3>

        {/* Render areas */}
        {currentQuestion.areas.map((area) => (
          <div key={area} className="mb-4">
            <h4 className="font-medium">{area}</h4>
            <div className="flex gap-4 mt-2">
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
                  <h5 className="text-sm font-semibold">{currentQuestion.subQuestion}</h5>
                  <textarea
                    className="border rounded w-full p-2 mt-1"
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
