"use client";
import { useEffect, useState } from "react";

interface ResponseData {
  questionID: string;
  area: string;
  response: string | { text: string; score: number };
}

interface UserResponses {
  success: boolean;
  data: ResponseData[];
  error?: string;
}

export default function UserResponses() {
  const [data, setData] = useState<Record<string, UserResponses> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/userResponses");
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch");
        }
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const generateCSV = (userName: string) => {
    if (!data || !data[userName] || !data[userName].success) return;
    
    const userData = data[userName].data;
    const csvRows = ["Question ID,Area,Response"];
    
    userData.forEach(response => {
      const responseText = typeof response.response === "object" ? response.response.text : response.response;
      csvRows.push(`"${response.questionID}","${response.area}","${responseText}"`);
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${userName}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-center text-white animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-200 font-medium">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-teal-300 via-teal-500 to-teal-700">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Responses</h1>
      {data && Object.keys(data).length === 0
        ? <p className="text-center text-gray-100">No responses available.</p>
        : Object.entries(data || {}).map(([userName, userData]) => (
            <div
              key={userName}
              className="mb-4 w-full max-w-3xl border border-gray-200 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              <button
                onClick={() =>
                  setExpandedUsers(prev => ({
                    ...prev,
                    [userName]: !prev[userName]
                  }))}
                className="w-full text-left text-lg font-semibold flex justify-between items-center text-gray-800 hover:text-gray-900 transition-colors"
              >
                <span>{userName}</span>
                <span className={`transform transition-transform ${expandedUsers[userName] ? "rotate-180" : "rotate-0"}`}>
                  ▼
                </span>
              </button>
              {expandedUsers[userName] && (
                <div className="mt-3">
                  {userData.success ? (
                    <>
                      <button
                        onClick={() => generateCSV(userName)}
                        className="mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        Generate CSV
                      </button>
                      <ul className="space-y-3">
                        {userData.data.map((response, index) => (
                          <li
                            key={index}
                            className="border p-3 rounded-lg bg-gray-100 bg-opacity-80 shadow-sm"
                          >
                            <p className="text-gray-700">
                              <strong className="text-gray-900">Question ID:</strong> {response.questionID}
                            </p>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">Area:</strong> {response.area}
                            </p>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">Response:</strong> {typeof response.response === "object" && response.response !== null ? response.response.text : response.response}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-red-500 font-medium">{userData.error}</p>
                  )}
                </div>
              )}
            </div>
          ))}
    </div>
  );
}
