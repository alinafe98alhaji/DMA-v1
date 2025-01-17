// "use client";
// import { useMemo,useEffect, useState } from "react";

// interface ScoreData {
//   area: string;
//   totalScore: number;
// }

// interface UserDetails {
//   name: string;
//   organisation: string;
//   country: string;
//   submittedAt: string; // You may want to format this timestamp
// }

// interface UserData {
//   [userId: string]: {
//     details: UserDetails;
//     collections: { [collectionName: string]: ScoreData[] };
//   };
// }

// export default function AdminDashboard() {
//   const [userData, setUserData] = useState<UserData>({});
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const apiEndpoints = useMemo(() => [{ collectionName: "responses", url: "/api/getAllUsersData" },
//     { collectionName: "data ownership and management", url: "/api/getAllUsersDataOwnershipAndManagement" },
//     { collectionName: "data openess and flow", url: "/api/getAllUsersDataOpenessAndFlow" },
//     { collectionName: "data quality", url: "/api/getAllUsersDataQuality" },
//     { collectionName: "data use", url: "/api/getAllUsersDataUse" }
//   ], []);

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const allUserData: UserData = {};

//         const responses = await Promise.all(
//           apiEndpoints.map(async ({ collectionName, url }) => {
//             const response = await fetch(url);
//             const result = await response.json();
//             if (result.success) {
//               return { collectionName, data: result.data };
//             } else {
//               setError(`Failed to fetch data for ${collectionName}`);
//               return null;
//             }
//           })
//         );

//         responses.forEach((response) => {
//           if (response && response.data) {
//             Object.keys(response.data).forEach((userId) => {
//               if (!allUserData[userId]) {
//                 // Initialize the user data structure with default details and empty collections
//                 allUserData[userId] = {
//                   details: { name: "Unknown", organisation: "Unknown", country: "Unknown", submittedAt: "" },
//                   collections: {},
//                 };
//               }

//               // Ensure details are set only once for the user
//               const user = response.data[userId];

//               if (!allUserData[userId].details.name) {
//                 allUserData[userId].details = {
//                   name: user.name || "Unknown",
//                   organisation: user.organisation || "Unknown",
//                   country: user.country || "Unknown",
//                   // Check if submittedAt is valid and format it correctly
//                   submittedAt: user.submittedAt && user.submittedAt.$date
//                     ? new Date(user.submittedAt.$date).toLocaleString()
//                     : "Unknown",
//                 };
//               }

//               // Add collection data to the user
//               allUserData[userId].collections[response.collectionName] = user.data;
//             });
//           }
//         });

//         setUserData(allUserData);
//       } catch (err) {
//         console.error(err);
//         setError("An error occurred while fetching data");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUserData();
//   }, [apiEndpoints]);

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-600">Error: {error}</div>;

//   const areas = userData && Object.values(userData)[0]
//     ? Object.values(userData)[0]["collections"]["data use"]?.map((item: ScoreData) => item.area) || []
//     : [];

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
//         <div className="p-4 font-bold text-lg border-b border-gray-700">
//           Admin Dashboard
//         </div>
//         <ul className="mt-4 space-y-2">
//           {apiEndpoints.map(({ collectionName }) => (
//             <li key={collectionName} className="px-4 py-2 hover:bg-gray-700">
//               {collectionName === "responses" ? "Data Collection" : collectionName}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-grow bg-gray-100">
//         {/* Navbar */}
//         <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
//           <button className="bg-red-500 text-white px-4 py-2 rounded shadow">
//             Logout
//           </button>
//         </nav>

//         {/* Dashboard Content */}
//         <div className="p-6">
//           {Object.keys(userData).map((userId) => {
//             const user = userData[userId];
//             return (
//               <div key={userId} className="mb-8">
//                 {/* Display user details */}
//                 <h2 className="text-xl font-semibold mb-4">
//                   <span className="font-bold">Name:</span> {user.details.name} <br />
//                   <span className="font-bold">Organisation:</span> {user.details.organisation} <br />
//                   <span className="font-bold">Country:</span> {user.details.country} <br />
//                   <span className="font-bold">Submitted At:</span> {user.details.submittedAt}
//                 </h2>

//                 <div className="overflow-x-auto">
//                   <table
//                     className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md"
//                     style={{ border: "3px solid black" }} // Black outer border
//                   >
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="px-4 py-2 text-left font-bold text-gray-900 border border-gray-400">
//                           Collection
//                         </th>
//                         {areas.map((area, index) => (
//                           <th
//                             key={area}
//                             className={`px-4 py-2 text-left font-bold text-gray-900 border border-gray-400 ${
//                               index === 0 ? "rounded-tl-lg" : ""
//                             } ${
//                               index === areas.length - 1 ? "rounded-tr-lg" : ""
//                             }`}
//                           >
//                             {area}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {apiEndpoints.map(({ collectionName }) => {
//                         const displayName = collectionName === "responses" ? "Data Collection" : collectionName;
//                         const collectionData = user.collections[collectionName];

//                         return (
//                           <tr key={collectionName} className="border-t">
//                             <td className="px-4 py-2 text-gray-800 font-medium border border-gray-400">
//                               {displayName}
//                             </td>
//                             {areas.map((area) => {
//                               const scoreData = collectionData?.find((data) => data.area === area);
//                               let bgColor = "bg-gray-100"; // Default background color
//                               let textColor = "text-gray-800"; // Default text color

//                               if (scoreData) {
//                                 if (scoreData.totalScore < 40) {
//                                   bgColor = "bg-red-600";
//                                   textColor = "text-white";
//                                 } else if (scoreData.totalScore < 70) {
//                                   bgColor = "bg-orange-500";
//                                   textColor = "text-white";
//                                 } else {
//                                   bgColor = "bg-green-500";
//                                   textColor = "text-white";
//                                 }
//                               }

//                               return (
//                                 <td
//                                   key={area}
//                                   className={`px-4 py-2 text-center border border-gray-400 ${bgColor} ${textColor}`}
//                                   style={{ minWidth: "100px", height: "50px" }}
//                                 >
//                                   {scoreData ? `${scoreData.totalScore.toFixed(2)}%` : "N/A"}
//                                 </td>
//                               );
//                             })}
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

//-----
//-----
//-----
//-----
// "use client";
// import { useMemo, useEffect, useState } from "react";

// interface ScoreData {
//   area: string;
//   totalScore: number;
// }

// interface UserDetails {
//   name: string;
//   organisation: string;
//   country: string;
//   submittedAt: string; // Formatted timestamp
// }

// interface UserData {
//   [userId: string]: {
//     details: UserDetails;
//     collections: { [collectionName: string]: ScoreData[] };
//   };
// }

// export default function AdminDashboard() {
//   const [userData, setUserData] = useState<UserData>({});
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fixed order for areas
//   const fixedAreaOrder = [
//     "Urban Water Supply Coverage",
//     "Urban Sanitation Sector Coverage",
//     "Rural Water Supply Sector Coverage",
//     "Rural Sanitation Sector Coverage",
//     "Finance",
//     "Regulation",
//     "Utility Operations: Technical, Commercial, Financial, HR",
//   ];

//   // API Endpoints for fetching collections
//   const apiEndpoints = useMemo(
//     () => [
//       { collectionName: "responses", url: "/api/getAllUsersData" },
//       { collectionName: "data ownership and management", url: "/api/getAllUsersDataOwnershipAndManagement" },
//       { collectionName: "data openness and flow", url: "/api/getAllUsersDataOpenessAndFlow" },
//       { collectionName: "data quality", url: "/api/getAllUsersDataQuality" },
//       { collectionName: "data use", url: "/api/getAllUsersDataUse" },
//     ],
//     []
//   );

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const allUserData: UserData = {};

//         const responses = await Promise.all(
//           apiEndpoints.map(async ({ collectionName, url }) => {
//             const response = await fetch(url);
//             const result = await response.json();
//             if (result.success) {
//               return { collectionName, data: result.data };
//             } else {
//               setError(`Failed to fetch data for ${collectionName}`);
//               return null;
//             }
//           })
//         );

//         responses.forEach((response) => {
//           if (response && response.data) {
//             Object.keys(response.data).forEach((userId) => {
//               if (!allUserData[userId]) {
//                 allUserData[userId] = {
//                   details: {
//                     name: "Unknown",
//                     organisation: "Unknown",
//                     country: "Unknown",
//                     submittedAt: "",
//                   },
//                   collections: {},
//                 };
//               }
//               allUserData[userId].collections[response.collectionName] =
//                 response.data[userId].data;
//             });
//           }
//         });

//         // Fetch user details for each userId
//         await Promise.all(
//           Object.keys(allUserData).map(async (userId) => {
//             const userDetailsResponse = await fetch(`/api/getUserInfo/${userId}`);
//             const userDetails = await userDetailsResponse.json();
//             if (userDetails.success) {
//               allUserData[userId].details = {
//                 name: userDetails.data.name,
//                 organisation: userDetails.data.organisation,
//                 country: userDetails.data.country,
//                 submittedAt: new Date(userDetails.data.submittedAt).toLocaleString(),
//               };
//             }
//           })
//         );

//         setUserData(allUserData);
//       } catch (err) {
//         setError("An error occurred while fetching data");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUserData();
//   }, [apiEndpoints]);

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-600">Error: {error}</div>;

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
//         <div className="p-4 font-bold text-lg border-b border-gray-700">
//           Admin Dashboard
//         </div>
//         <ul className="mt-4 space-y-2">
//           {apiEndpoints.map(({ collectionName }) => (
//             <li key={collectionName} className="px-4 py-2 hover:bg-gray-700">
//               {collectionName === "responses" ? "Data Collection" : collectionName}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-grow h-screen bg-gray-100">
//         {/* Navbar */}
//         <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
//         </nav>

//         {/* Dashboard Content */}
//         <div className="p-6">
//           {Object.keys(userData).map((userId) => {
//             const user = userData[userId];
//             return (
//               <div key={userId} className="mb-8">
//                 <h2 className="text-xl mt-10 font-semibold mb-4 text-gray-900">
//                   <span className="font-bold">User ID:</span> {userId} <br />
//                   <span className="font-bold">Name:</span> {user.details.name} <br />
//                   <span className="font-bold">Organisation:</span>{" "}
//                   {user.details.organisation} <br />
//                   <span className="font-bold">Country:</span> {user.details.country} <br />
//                   <span className="font-bold">Submitted At:</span>{" "}
//                   {user.details.submittedAt}
//                 </h2>

//                 <div className="overflow-x-auto">
//                   <table
//                     className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md"
//                     style={{ border: "3px solid black" }}
//                   >
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="px-4 py-2 text-left font-bold text-gray-900 border border-gray-400">
//                           Section
//                         </th>
//                         {fixedAreaOrder.map((area) => (
//                           <th
//                             key={area}
//                             className="px-4 py-2 text-left font-bold text-gray-900 border border-gray-400"
//                           >
//                             {area}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {apiEndpoints.map(({ collectionName }) => {
//                         const displayName =
//                           collectionName === "responses"
//                             ? "Data Collection"
//                             : collectionName;
//                         const collectionData = user.collections[collectionName];

//                         return (
//                           <tr key={collectionName} className="border-t">
//                             <td className="px-4 py-2 text-gray-800 font-medium border border-gray-400">
//                               {displayName}
//                             </td>
//                             {fixedAreaOrder.map((area) => {
//                               const scoreData = collectionData?.find(
//                                 (data) => data.area === area
//                               );

//                               const bgColor = !scoreData
//                                 ? "bg-gray-100"
//                                 : scoreData.totalScore < 40
//                                 ? "bg-red-600 text-white"
//                                 : scoreData.totalScore < 70
//                                 ? "bg-orange-500 text-white"
//                                 : "bg-green-500 text-white";

//                               const roundedScore = scoreData
//                                 ? Number(scoreData.totalScore.toFixed(2))
//                                 : null;

//                               return (
//                                 <td
//                                   key={area}
//                                   className={`px-4 py-2 text-center border border-gray-400 ${bgColor}`}
//                                 >
//                                   {roundedScore !== null ? `${roundedScore}%` : "N/A"}
//                                 </td>
//                               );
//                             })}
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

//---------------
//---------------
//---------------
"use client";
import { useMemo, useEffect, useState } from "react";

interface ScoreData {
  area: string;
  totalScore: number;
}

interface UserDetails {
  name: string;
  organisation: string;
  country: string;
  submittedAt: string; // Formatted timestamp
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

  const apiEndpoints = useMemo(
    () => [
      { collectionName: "responses", url: "/api/getAllUsersData" },
      {
        collectionName: "data ownership and management",
        url: "/api/getAllUsersDataOwnershipAndManagement",
      },
      {
        collectionName: "data openness and flow",
        url: "/api/getAllUsersDataOpenessAndFlow",
      },
      { collectionName: "data quality", url: "/api/getAllUsersDataQuality" },
      { collectionName: "data use", url: "/api/getAllUsersDataUse" },
    ],
    []
  );

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
                allUserData[userId] = {
                  details: {
                    name: "Unknown",
                    organisation: "Unknown",
                    country: "Unknown",
                    submittedAt: "",
                  },
                  collections: {},
                };
              }
              allUserData[userId].collections[response.collectionName] =
                response.data[userId].data;
            });
          }
        });

        await Promise.all(
          Object.keys(allUserData).map(async (userId) => {
            const userDetailsResponse = await fetch(
              `/api/getUserInfo/${userId}`
            );
            const userDetails = await userDetailsResponse.json();
            if (userDetails.success) {
              allUserData[userId].details = {
                name: userDetails.data.name,
                organisation: userDetails.data.organisation,
                country: userDetails.data.country,
                submittedAt: new Date(
                  userDetails.data.submittedAt
                ).toLocaleString(),
              };
            }
          })
        );

        setUserData(allUserData);
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [apiEndpoints]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const areas =
    userData &&
    Object.values(userData)[0]?.collections["data use"]?.map(
      (item: ScoreData) => item.area
    ) || [];

    const getColorForScore = (score: number | null) => {
      if (score === null || score === undefined) return "bg-gray-200"; // Default gray for missing data
    
      // Red: Start dark and lighten up as the score increases (bad values)
      if (score <= 20) {
        if (score <= 4) return "bg-red-800 text-white"; // Dark Red
        if (score <= 8) return "bg-red-700 text-white"; // Medium Red
        if (score <= 12) return "bg-red-600 text-white"; // Lighter Red
        return "bg-red-500 text-white"; // Light Red
      }
    
      // Yellow/Amber: Start from light yellow and increase towards amber (medium values)
      if (score <= 50) {
        if (score <= 30) return "bg-yellow-400 text-black"; // Light Yellow
        if (score <= 40) return "bg-amber-400 text-black"; // Amber
        return "bg-orange-400 text-black"; // Medium Orange
      }
    
      // Green: Start light and get progressively darker (good values)
      if (score <= 60) return "bg-green-500 text-white"; // Light Green
      if (score <= 70) return "bg-green-600 text-white"; // Medium Green
      if (score <= 80) return "bg-green-700 text-white"; // Green
      if (score <= 90) return "bg-green-800 text-white"; // Darker Green
      return "bg-green-600 text-white"; // Very Dark Green (Excellent)
    };
    

  return (
    <div className="flex h-screen">
    {/* Sidebar 
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Admin Dashboard
        </div>
        <ul className="mt-4 space-y-2">
          {apiEndpoints.map(({ collectionName }) => (
            <li key={collectionName} className="px-4 py-2 hover:bg-gray-700">
              {collectionName === "responses"
                ? "Data Collection"
                : collectionName}
            </li>
          ))}
        </ul>
      </aside>*/}

      {/* Main Content */}
      <div className="flex-grow h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </nav>

        <div className="p-6">
          {Object.keys(userData).map((userId) => {
            const user = userData[userId];
            return (
              <div key={userId} className="mb-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    <span className="font-bold">User:</span> {user.details.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Organization:</span> {user.details.organisation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Country:</span> {user.details.country}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Submitted At:</span> {user.details.submittedAt}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left font-bold text-gray-900"></th>
                        {areas.map((area) => (
                          <th
                            key={area}
                            className="px-4 py-2 text-left font-bold text-gray-900 border border-gray-400"
                          >
                            {area}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {apiEndpoints.map(({ collectionName }) => {
                        const displayName =
                          collectionName === "responses"
                            ? "data collection"
                            : collectionName;
                        const collectionData = user.collections[collectionName];

                        return (
                          <tr key={collectionName} className="border-t">
                            <td className="px-4 py-2 font-medium border text-gray-900 border-gray-400">
                              {displayName}
                            </td>
                            {areas.map((area) => {
                              const scoreData = collectionData?.find(
                                (data) => data.area === area
                              );
                              const score = scoreData
                                ? Number(scoreData.totalScore.toFixed(2))
                                : null;

                              return (
                                <td
                                  key={area}
                                  className={`px-4 py-2 text-center border border-gray-400 ${getColorForScore(
                                    score
                                  )}`}
                                >
                                  {score !== null ? `${score}%` : "N/A"}
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
