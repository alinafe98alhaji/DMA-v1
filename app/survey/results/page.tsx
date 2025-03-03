"use client";

import { useEffect, useState } from "react";

interface SurveyResult {
  completionId: string;
  results: { area: string; percentage: number }[];
}

export default function ResultsPage() {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/getData");
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch results");

        setResults(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Survey Results</h1>

      {loading && <p>Loading results...</p>}
      {error &&
        <p className="text-red-500">
          {error}
        </p>}

      {!loading &&
        !error &&
        results.length === 0 &&
        <p>No survey results found.</p>}

      {!loading &&
        !error &&
        results.length > 0 &&
        <div className="space-y-6">
          {results.map(({ completionId, results }) =>
            <div
              key={completionId}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-bold">
                Survey ID: {completionId}
              </h2>
              <table className="w-full mt-2 border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Area</th>
                    <th className="p-2 border">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(({ area, percentage }) =>
                    <tr key={area} className="border">
                      <td className="p-2 border">
                        {area}
                      </td>
                      <td className="p-2 border">
                        {percentage.toFixed(2)}%
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>}
    </div>
  );
}
