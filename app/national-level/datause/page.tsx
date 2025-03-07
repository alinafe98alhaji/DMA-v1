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

// Questions data
const questions = [
  {
    id: "5a",
    title:
      "5.a. Are there centrally managed, accessible platforms for data analysis and visualisation?",
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
    title:
      "5.b. Are there incentives to promote data driven decision making?",
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
    title:
      "5.c. Are there established, standard, sector-wide KPIs?",
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
    subQuestion: "5.c.i. Which organisation is mandated to develop and maintain standard sector-wide KPIs?",
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
    subQuestion: "5.d.i. Which organisation is mandated to develop and maintain these training and capacity building programmes?",
  }
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
  const handleNext = async () => {
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
      try {
        const res = await fetch("/api/saveDu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "someUserId", // Replace with actual user ID if available
            responses,
            subResponses,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save responses");

        console.log("Responses saved successfully:", data);

        //router.push("/national-level/dataownershipandmanagement");
      } catch (error) {
        console.error("Error saving responses:", error);
        setError("Failed to save responses. Please try again.");
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <h1 className="text-2xl text-gray-900 font-bold mb-4 p-6 bg-white shadow-md">
        Data Use
      </h1>

      {/* Error Message */}
      {error && <p className="text-red-600 font-semibold mb-3 px-6">{error}</p>}

      {/* Current Question */}
      <div className="flex-1 overflow-y-auto p-6">
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
      </div>

      {/* Navigation */}
      <div className="p-6 bg-white shadow-md flex justify-center">
        <button
          className="px-8 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-cyan-600 transition text-lg"
          onClick={handleNext}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
}