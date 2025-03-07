"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";

interface Response {
  _id: string;
  userId: string;
  responses: { [key: string]: { [area: string]: string } };
  subResponses: { [key: string]: string };
  timestamp: string;
}

const ResponsesPage: NextPage = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Toggle dark mode
  useEffect(
    () => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    [isDarkMode]
  );

  // Fetch responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch("/api/getNational");
        const data = await res.json();

        console.log("API Response Data:", data); // Debugging

        if (res.ok) {
          console.log("Responses:", data.responses); // Debugging
          setResponses(data.responses);
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        console.error("Fetch Error:", err); // Debugging
        setError("Failed to fetch responses");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded-md max-w-md">
          <p>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 dark:bg-blue-400 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
      >
        {isDarkMode ? "🌙" : "☀️"}
      </button>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Your Responses
        </h1>

        {responses.length === 0
          ? <div className="text-center text-gray-600 dark:text-gray-400">
              <p>No responses found.</p>
            </div>
          : <div className="space-y-6">
              {responses.map(response =>
                <div
                  key={response._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Response ID:{" "}
                      <span className="text-blue-600 dark:text-blue-400">
                        {response._id}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      User ID: {response.userId}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Timestamp: {new Date(response.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Responses
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                          {JSON.stringify(response.responses, null, 2)}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Sub-Responses
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                          {JSON.stringify(response.subResponses, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>}
      </div>
    </div>
  );
};

export default ResponsesPage;
