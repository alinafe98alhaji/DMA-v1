"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ScoreData {
  area: string;
  totalScore: number;
}

interface UserDetails {
  name: string;
  organisation: string;
  country: string;
  submittedAt: string;
}

interface UserData {
  [userId: string]: {
    details: UserDetails;
    collections: { [collectionName: string]: ScoreData[] };
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const apiEndpoints = [
    { collectionName: "Data Collection", url: "/api/getAllUsersData" },
    { collectionName: "Data Ownership And Management", url: "/api/getAllUsersDataOwnershipAndManagement" },
    { collectionName: "Data Openness And Flow", url: "/api/getAllUsersDataOpenessAndFlow" },
    { collectionName: "Data Quality", url: "/api/getAllUsersDataQuality" },
    { collectionName: "Data Use", url: "/api/getAllUsersDataUse" },
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
                allUserData[userId] = {
                  details: { name: "Unknown", organisation: "Unknown", country: "Unknown", submittedAt: "" },
                  collections: {},
                };
              }
              allUserData[userId].collections[response.collectionName] = response.data[userId].data;
            });
          }
        });

        await Promise.all(
          Object.keys(allUserData).map(async (userId) => {
            const userDetailsResponse = await fetch(`/api/getUserInfo/${userId}`);
            const userDetails = await userDetailsResponse.json();
            if (userDetails.success) {
              allUserData[userId].details = {
                name: userDetails.data.name,
                organisation: userDetails.data.organisation,
                country: userDetails.data.country,
                submittedAt: new Date(userDetails.data.submittedAt).toLocaleString(),
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
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const userOptions = Object.keys(userData).map((userId) => ({
    id: userId,
    name: userData[userId].details.name,
  }));

  const selectedUserData = selectedUser ? userData[selectedUser] : null;

  function getScoreColor(score: number) {
    if (score >= 91) return "bg-green-700";
    if (score >= 81) return "bg-green-200";
    if (score >= 71) return "bg-yellow-200";
    if (score >= 61) return "bg-orange-400";
    if (score >= 41) return "bg-orange-100";
    return "bg-red-600";
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Admin Dashboard
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium mb-2">Select User</label>
          <select
            className="w-full p-2 border border-gray-400 rounded"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value || null)}
          >
            <option value="">-- Select a User --</option>
            {userOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">User Details</h1>
          {/* ✅ Added Button to Navigate to Responses Page */}
          <button
            onClick={() => router.push("/adminDash/responses")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            View Responses
          </button>
        </nav>

        <div className="p-6">
          {!selectedUserData ? (
            <div className="text-center text-gray-500">Select a user to view their data.</div>
          ) : (
            <div>
              {/* User Info */}
              <div className="mb-6 bg-white shadow-md p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">User Information</h2>
                <p className="text-sm"><span className="font-bold">Name:</span> {selectedUserData.details.name}</p>
                <p className="text-sm"><span className="font-bold">Organization:</span> {selectedUserData.details.organisation}</p>
                <p className="text-sm"><span className="font-bold">Country:</span> {selectedUserData.details.country}</p>
                <p className="text-sm"><span className="font-bold">Submitted At:</span> {selectedUserData.details.submittedAt}</p>
              </div>

              {/* User Scores */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left font-bold text-gray-900">Collection Name</th>
                      {selectedUserData.collections["Data Collection"]?.map((item) => (
                        <th key={item.area} className="px-4 py-2 text-left font-bold text-gray-900">{item.area}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apiEndpoints.map(({ collectionName }) => (
                      <tr key={collectionName} className="border-t">
                        <td className="px-4 py-2 font-bold border border-gray-400">{collectionName}</td>
                        {selectedUserData.collections["Data Collection"]?.map((item) => {
                          const scoreData = selectedUserData.collections[collectionName]?.find((data) => data.area === item.area);
                          return (
                            <td key={item.area} className={`px-4 py-2 text-center border border-gray-400 ${scoreData ? getScoreColor(scoreData.totalScore) : ""}`}>
                              {scoreData ? `${scoreData.totalScore.toFixed(2)}%` : "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//---------------
//---------------
//---------------
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

//   const apiEndpoints = useMemo(
//     () => [
//       { collectionName: "responses", url: "/api/getAllUsersData" },
//       {
//         collectionName: "data ownership and management",
//         url: "/api/getAllUsersDataOwnershipAndManagement",
//       },
//       {
//         collectionName: "data openness and flow",
//         url: "/api/getAllUsersDataOpenessAndFlow",
//       },
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

//         await Promise.all(
//           Object.keys(allUserData).map(async (userId) => {
//             const userDetailsResponse = await fetch(
//               `/api/getUserInfo/${userId}`
//             );
//             const userDetails = await userDetailsResponse.json();
//             if (userDetails.success) {
//               allUserData[userId].details = {
//                 name: userDetails.data.name,
//                 organisation: userDetails.data.organisation,
//                 country: userDetails.data.country,
//                 submittedAt: new Date(
//                   userDetails.data.submittedAt
//                 ).toLocaleString(),
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

//   const areas =
//     userData &&
//     Object.values(userData)[0]?.collections["data use"]?.map(
//       (item: ScoreData) => item.area
//     ) || [];

//     const getColorForScore = (score: number | null) => {
//       if (score === null || score === undefined) return "bg-gray-200"; // Default gray for missing data

//       // Red: Start dark and lighten up as the score increases (bad values)
//       if (score <= 20) {
//         if (score <= 4) return "bg-red-800 text-white"; // Dark Red
//         if (score <= 8) return "bg-red-700 text-white"; // Medium Red
//         if (score <= 12) return "bg-red-600 text-white"; // Lighter Red
//         return "bg-red-500 text-white"; // Light Red
//       }

//       // Yellow/Amber: Start from light yellow and increase towards amber (medium values)
//       if (score <= 50) {
//         if (score <= 30) return "bg-yellow-400 text-black"; // Light Yellow
//         if (score <= 40) return "bg-amber-400 text-black"; // Amber
//         return "bg-orange-400 text-black"; // Medium Orange
//       }

//       // Green: Start light and get progressively darker (good values)
//       if (score <= 60) return "bg-green-500 text-white"; // Light Green
//       if (score <= 70) return "bg-green-600 text-white"; // Medium Green
//       if (score <= 80) return "bg-green-700 text-white"; // Green
//       if (score <= 90) return "bg-green-800 text-white"; // Darker Green
//       return "bg-green-600 text-white"; // Very Dark Green (Excellent)
//     };

//   return (
//     <div className="flex h-screen">
//     {/* Sidebar
//       <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
//         <div className="p-4 font-bold text-lg border-b border-gray-700">
//           Admin Dashboard
//         </div>
//         <ul className="mt-4 space-y-2">
//           {apiEndpoints.map(({ collectionName }) => (
//             <li key={collectionName} className="px-4 py-2 hover:bg-gray-700">
//               {collectionName === "responses"
//                 ? "Data Collection"
//                 : collectionName}
//             </li>
//           ))}
//         </ul>
//       </aside>*/}

//       {/* Main Content */}
//       <div className="flex-grow h-screen bg-gray-100">
//         <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
//         </nav>

//         <div className="p-6">
//           {Object.keys(userData).map((userId) => {
//             const user = userData[userId];
//             return (
//               <div key={userId} className="mb-8">
//                 <div className="mb-4">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     <span className="font-bold">User:</span> {user.details.name}
//                   </h2>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Organization:</span> {user.details.organisation}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Country:</span> {user.details.country}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Submitted At:</span> {user.details.submittedAt}
//                   </p>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="px-4 py-2 text-left font-bold text-gray-900"></th>
//                         {areas.map((area) => (
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
//                             ? "data collection"
//                             : collectionName;
//                         const collectionData = user.collections[collectionName];

//                         return (
//                           <tr key={collectionName} className="border-t">
//                             <td className="px-4 py-2 font-medium border text-gray-900 border-gray-400">
//                               {displayName}
//                             </td>
//                             {areas.map((area) => {
//                               const scoreData = collectionData?.find(
//                                 (data) => data.area === area
//                               );
//                               const score = scoreData
//                                 ? Number(scoreData.totalScore.toFixed(2))
//                                 : null;

//                               return (
//                                 <td
//                                   key={area}
//                                   className={`px-4 py-2 text-center border border-gray-400 ${getColorForScore(
//                                     score
//                                   )}`}
//                                 >
//                                   {score !== null ? `${score}%` : "N/A"}
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
// "use client";
// import { useEffect, useState } from "react";

// interface ScoreData {
//   area: string;
//   totalScore: number;
// }

// interface UserDetails {
//   name: string;
//   organisation: string;
//   country: string;
//   submittedAt: string;
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
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const [rawApiData, setRawApiData] = useState<any | null>(null); // For storing raw API data

//   const apiEndpoints = [
//     { collectionName: "Data Collection", url: "/api/getAllUsersData" },
//     {
//       collectionName: "Data Ownership And Management",
//       url: "/api/getAllUsersDataOwnershipAndManagement",
//     },
//     {
//       collectionName: "Data Openness And Flow",
//       url: "/api/getAllUsersDataOpenessAndFlow",
//     },
//     { collectionName: "Data Quality", url: "/api/getAllUsersDataQuality" },
//     { collectionName: "Data Use", url: "/api/getAllUsersDataUse" },
//   ];

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const allUserData: UserData = {};
//         const responses = await Promise.all(
//           apiEndpoints.map(async ({ collectionName, url }) => {
//             const response = await fetch(url);
//             const result = await response.json();
//             if (result.success) {
//               setRawApiData(result); // Store raw API response
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

//         await Promise.all(
//           Object.keys(allUserData).map(async (userId) => {
//             const userDetailsResponse = await fetch(
//               `/api/getUserInfo/${userId}`
//             );
//             const userDetails = await userDetailsResponse.json();
//             if (userDetails.success) {
//               allUserData[userId].details = {
//                 name: userDetails.data.name,
//                 organisation: userDetails.data.organisation,
//                 country: userDetails.data.country,
//                 submittedAt: new Date(
//                   userDetails.data.submittedAt
//                 ).toLocaleString(),
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
//   }, []);

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-600">Error: {error}</div>;

//   const userOptions = Object.keys(userData).map((userId) => ({
//     id: userId,
//     name: userData[userId].details.name,
//   }));

//   const selectedUserData = selectedUser ? userData[selectedUser] : null;

//   // Function to return color based on score percentage
//   function getScoreColor(score: number) {
//     if (score >= 91) return "bg-green-500"; // Dark green
//     if (score >= 81) return "bg-green-500"; // Light green
//     if (score >= 71) return "bg-yellow-500"; // Yellow
//     if (score >= 61) return "bg-orange-500"; // Orange
//     if (score >= 41) return "bg-orange-300"; // Light orange
//     return "bg-red-600"; // Dark red
//   }

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
//         <div className="p-4 font-bold text-lg border-b border-gray-700">
//           Admin Dashboard
//         </div>
//         <div className="p-4">
//           <label className="block text-sm font-medium mb-2">Select User</label>
//           <select
//             className="w-full p-2 border border-gray-400 rounded"
//             value={selectedUser || ""}
//             onChange={(e) => setSelectedUser(e.target.value || null)}
//           >
//             <option value="">-- Select a User --</option>
//             {userOptions.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-grow h-screen bg-gray-100">
//         <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">User Details</h1>
//         </nav>

//         <div className="p-6">
//           {!selectedUserData ? (
//             <div className="text-center text-gray-500">
//               Select a user to view their data.
//             </div>
//           ) : (
//             <div>
//               {/* User Info */}
//               <div className="mb-6 bg-white shadow-md p-4 rounded-lg">
//                 <h2 className="text-lg font-bold mb-2">User Information</h2>
//                 <p className="text-sm">
//                   <span className="font-bold">Name:</span>{" "}
//                   {selectedUserData.details.name}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Organization:</span>{" "}
//                   {selectedUserData.details.organisation}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Country:</span>{" "}
//                   {selectedUserData.details.country}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Submitted At:</span>{" "}
//                   {selectedUserData.details.submittedAt}
//                 </p>
//               </div>

//               {/* User Scores */}
//               <div className="overflow-x-auto">
//                 <table className="min-w-full table-fixed border-collapse rounded-lg overflow-hidden shadow-md">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="px-4 py-2 text-left font-bold text-gray-900">
//                         Collection Name
//                       </th>
//                       {selectedUserData.collections["Data Collection"]?.map(
//                         (item) => (
//                           <th
//                             key={item.area}
//                             className="px-4 py-2 text-left font-bold text-gray-900"
//                           >
//                             {item.area}
//                           </th>
//                         )
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {apiEndpoints.map(({ collectionName }) => (
//                       <tr key={collectionName} className="border-t">
//                         <td className="px-4 py-2 font-bold border border-gray-400">
//                           {collectionName}
//                         </td>
//                         {selectedUserData.collections["Data Collection"]?.map(
//                           (item) => {
//                             const scoreData =
//                               selectedUserData.collections[collectionName]?.find(
//                                 (data) => data.area === item.area
//                               );
//                             return (
//                               <td
//                                 key={item.area}
//                                 className={`px-4 py-2 text-center border border-gray-400 ${scoreData ? getScoreColor(scoreData.totalScore) : ""}`}
//                               >
//                                 {scoreData
//                                   ? `${scoreData.totalScore.toFixed(2)}%`
//                                   : "N/A"}
//                               </td>
//                             );
//                           }
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Display Raw JSON Data */}
//           <div className="mt-8">
//             <h2 className="text-lg font-bold mb-2">Raw API Data</h2>
//             <pre className="bg-gray-800 text-white p-4 rounded-lg">
//               <code>{JSON.stringify(rawApiData, null, 2)}</code>
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
