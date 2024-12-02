"use client"; // This is necessary for client-side hooks in Next.js

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Question5dV = () => {
  const searchParams = useSearchParams();
  const areasFor1dv = searchParams.get("areasFor1dv"); // Get the areas passed from the URL

  const [areas, setAreas] = useState<string[]>([]);

  useEffect(
    () => {
      if (areasFor1dv) {
        const areasArray = JSON.parse(areasFor1dv); // Parse the areasFor1av from query string
        setAreas(areasArray); // Store them in state
      }
    },
    [areasFor1dv]
  );

  // If no areas are selected, return a message
  if (areas.length === 0) {
    return <div>No areas to display.</div>;
  }

  return (
    <div className="p-6">
      {/* Guidance Instructions */}
      <div className="mb-6 p-6 border border-blue-500 rounded-md bg-blue-50">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          Guidance Instructions
        </h2>
        <ul className="list-disc pl-6 text-black">
          <h1 className="mb-4 text-lg font-bold">
            Data Use Assessment Organisational Level
          </h1>
          <li>
            This question examines if your organisation conducts internal
            training and capacity building initiatives in data related aspects
          </li>
        </ul>
      </div>
      <h1>
        5.d.v: Does your organisation run internal data-related capacity
        building/training programmes?
      </h1>
      {areas.map((area, index) =>
        <div key={index} className="md-4 mt-4">
          <label>
            {area}
          </label>
          <div>
            <label>
              <input
                type="radio"
                name={area}
                value="Yes"
                // Handle radio changes
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="Partially"
                // Handle radio changes
              />
              Partially
            </label>
            <label>
              <input
                type="radio"
                name={area}
                value="No"
                // Handle radio changes
              />
              No
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question5dV;
