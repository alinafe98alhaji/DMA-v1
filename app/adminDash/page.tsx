"use client";
import { useEffect, useState } from "react";

interface ScoreData {
  area: string;
  totalScore: number;
}

interface UserDetails {
  name: string;
  organisation: string;
  country: string;
  submittedAt: string; // You may want to format this timestamp
}

interface UserData {
  [userId: string]: {
    details: UserDetails;
    collections: { [collectionName: string]: ScoreData[] };
  };
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints = [
    { collectionName: "responses", url: "/api/getAllUsersData" },
    { collectionName: "data ownership and management", url: "/api/getAllUsersDataOwnershipAndManagement" },
    { collectionName: "data openess and flow", url: "/api/getAllUsersDataOpenessAndFlow" },
    { collectionName: "data quality", url: "/api/getAllUsersDataQuality" },
    { collectionName: "data use", url: "/api/getAllUsersDataUse" }
  ];

  useEffect(() => {
    async function fetchUserData() {
      try {
        const allUserData: UserData = {};
        const responses = await Promise.all(
          apiEndpoints.map(async ({ collectionName, url }) => {
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
              return { collectionName, data: result.data };
            } else {
              setError(`Failed to fetch data for ${collectionName}`);
              return null;
            }
          })
        );

        responses.forEach((response) => {
          if (response && response.data) {
            Object.keys(response.data).forEach((userId) => {
              if (!allUserData[userId]) {
                allUserData[userId] = { details: { name: "Unknown", organisation: "Unknown", country: "Unknown", submittedAt: "" }, collections: {} };
              }
              allUserData[userId].collections[response.collectionName] = response.data[userId].data;
              // Add user details if not already added
              allUserData[userId].details = {
                name: response.data[userId].name || "Unknown",
                organisation: response.data[userId].organisation || "Unknown",
                country: response.data[userId].country || "Unknown",
                submittedAt: new Date(response.data[userId].submittedAt?.$date).toLocaleString() || "Unknown",
              };
            });
          }
        });

        setUserData(allUserData);
      } catch /*(err)*/ {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [apiEndpoints]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const areas = userData && Object.values(userData)[0]
    ? Object.values(userData)[0]["collections"]["data use"]?.map((item: ScoreData) => item.area) || []
    : [];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Admin Dashboard
        </div>
        <ul className="mt-4 space-y-2">
          {apiEndpoints.map(({ collectionName }) => (
            <li key={collectionName} className="px-4 py-2 hover:bg-gray-700">
              {collectionName === "responses" ? "Data Collection" : collectionName}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded shadow">
            Logout
          </button>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6">
          {Object.keys(userData).map((userId) => {
            const user = userData[userId];
            return (
              <div key={userId} className="mb-8">
                {/* Display user details */}
                <h2 className="text-xl font-semibold mb-4">
                  <span className="font-bold">Name:</span> {user.details.name} <br />
                  <span className="font-bold">Organisation:</span> {user.details.organisation} <br />
                  <span className="font-bold">Country:</span> {user.details.country} <br />
                  <span className="font-bold">Submitted At:</span> {user.details.submittedAt}
                </h2>

                <div className="overflow-x-auto">
                  <table
                    className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md"
                    style={{ border: "3px solid black" }} // Black outer border
                  >
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left font-bold text-gray-900 border border-gray-400">
                          Collection
                        </th>
                        {areas.map((area, index) => (
                          <th
                            key={area}
                            className={`px-4 py-2 text-left font-bold text-gray-900 border border-gray-400 ${
                              index === 0 ? "rounded-tl-lg" : ""
                            } ${
                              index === areas.length - 1 ? "rounded-tr-lg" : ""
                            }`}
                          >
                            {area}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {apiEndpoints.map(({ collectionName }) => {
                        const displayName = collectionName === "responses" ? "Data Collection" : collectionName;
                        const collectionData = user.collections[collectionName];

                        return (
                          <tr key={collectionName} className="border-t">
                            <td className="px-4 py-2 text-gray-800 font-medium border border-gray-400">
                              {displayName}
                            </td>
                            {areas.map((area) => {
                              const scoreData = collectionData?.find((data) => data.area === area);
                              let bgColor = "bg-gray-100"; // Default background color
                              let textColor = "text-gray-800"; // Default text color

                              if (scoreData) {
                                if (scoreData.totalScore < 40) {
                                  bgColor = "bg-red-600";
                                  textColor = "text-white";
                                } else if (scoreData.totalScore < 70) {
                                  bgColor = "bg-orange-500";
                                  textColor = "text-white";
                                } else {
                                  bgColor = "bg-green-500";
                                  textColor = "text-white";
                                }
                              }

                              return (
                                <td
                                  key={area}
                                  className={`px-4 py-2 text-center border border-gray-400 ${bgColor} ${textColor}`}
                                  style={{ minWidth: "100px", height: "50px" }}
                                >
                                  {scoreData ? `${scoreData.totalScore.toFixed(2)}%` : "N/A"}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
