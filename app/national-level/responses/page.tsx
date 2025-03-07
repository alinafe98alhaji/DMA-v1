"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";

interface Response {
  _id: string;
  userId: string;
  responses: { [key: string]: { [area: string]: string } }; // Updated structure
  subResponses: { [key: string]: string }; // Updated structure
  timestamp: string;
}

const ResponsesPage: NextPage = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Your Responses</h1>

      {responses.length === 0
        ? <p>No responses found.</p>
        : <div className="space-y-4">
            {responses.map(response =>
              <div
                key={response._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold">
                  Response ID: {response._id}
                </h3>
                <p className="text-sm text-gray-600">
                  User ID: {response.userId}
                </p>
                <p className="text-sm text-gray-600">
                  Timestamp: {response.timestamp}
                </p>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Responses:</h4>
                  <pre className="text-sm text-gray-700 mt-2">
                    {JSON.stringify(response.responses, null, 2)}
                  </pre>
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Sub-Responses:</h4>
                  <pre className="text-sm text-gray-700 mt-2">
                    {JSON.stringify(response.subResponses, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>}
    </div>
  );
};

export default ResponsesPage;
