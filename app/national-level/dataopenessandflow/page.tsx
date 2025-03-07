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
    id: "3a",
    title:
      "3.a. Are there clear rules and regular processes across the WSS sector for easy data sharing, using the same formats and labels?",
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
      "3.a.i. Which organisation is mandated to define these rules and processes to support data sharing?",
  },
  {
    id: "3b",
    title:
      "3.b. Are there central platforms that help share and manage data easily?",
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
      "3.b.i. Which organisation is mandated to develop and maintain technical systems to facilitate data sharing?",
  },
  {
    id: "3c",
    title:
      "3.c. Are there clear rules or policies in the WSS sector for sharing data freely and publicly?",
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
    subQuestion: "3.c.i. Which organisation is mandated to define rules for public data sharing?",
  },
];

export default function Survey() {
  const [responses, setResponses] = useState<Responses>({});
  const [subResponses, setSubResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
        const res = await fetch("/api/saveDoaf", {
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

        // Show the success modal
        setIsModalOpen(true);

      } catch (error) {
        console.error("Error saving responses:", error);
        setError("Failed to save responses. Please try again.");
      }
    }
  };

  // Close the modal and optionally redirect
  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally, redirect the user to another page
    //router.push("/national-level/dataopennessandflow");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <h1 className="text-2xl text-gray-900 font-bold mb-4 p-6 bg-white shadow-md">
        Data Openness and Flow
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
      <div className="flex justify-center p-6 bg-white shadow-md">
        <button
          className="px-8 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-cyan-600 transition text-lg"
          onClick={handleNext}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
        </button>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Success!</h2>
            <p>Your responses have been saved successfully.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}