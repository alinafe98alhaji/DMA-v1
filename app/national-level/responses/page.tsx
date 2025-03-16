// "use client";

// import { useEffect, useState } from "react";
// import { NextPage } from "next";
// import {
//   BellIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   CogIcon,
//   HomeIcon,
//   MagnifyingGlassIcon,
//   MoonIcon,
//   SunIcon
// } from "@heroicons/react/24/solid"; // Import icons
// import { useRouter } from "next/navigation"; // Use the correct import

// interface Response {
//   _id: string;
//   userId: string;
//   responses: { [key: string]: { [area: string]: string } };
//   subResponses: { [key: string]: string };
//   timestamp: string;
// }

// const ResponsesPage: NextPage = () => {
//   const [responses, setResponses] = useState<Response[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
//   const [expandedSections, setExpandedSections] = useState<{
//     [key: string]: boolean;
//   }>({});

//   const router = useRouter(); // Use the useRouter hook

//   // Detect system preference and set initial dark mode state
//   useEffect(() => {
//     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)")
//       .matches;
//     const savedDarkMode = localStorage.getItem("darkMode");

//     // Use saved preference if available, otherwise use system preference
//     setIsDarkMode(savedDarkMode ? savedDarkMode === "true" : systemPrefersDark);
//   }, []);

//   // Listen for system preference changes
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

//     const handleSystemPreferenceChange = (e: MediaQueryListEvent) => {
//       // Only update if the user hasn't manually toggled dark mode
//       const savedDarkMode = localStorage.getItem("darkMode");
//       if (savedDarkMode === null) {
//         setIsDarkMode(e.matches);
//       }
//     };

//     mediaQuery.addEventListener("change", handleSystemPreferenceChange);

//     // Cleanup listener on unmount
//     return () => {
//       mediaQuery.removeEventListener("change", handleSystemPreferenceChange);
//     };
//   }, []);

//   // Apply dark mode class to <html> element
//   useEffect(
//     () => {
//       if (isDarkMode) {
//         document.documentElement.classList.add("dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//       }

//       // Save preference to localStorage
//       localStorage.setItem("darkMode", isDarkMode.toString());
//     },
//     [isDarkMode]
//   );

//   // Fetch responses
//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const res = await fetch("/api/getNational");
//         const data = await res.json();

//         console.log("API Response Data:", data); // Debugging

//         if (res.ok) {
//           console.log("Responses:", data.responses); // Debugging
//           setResponses(data.responses);
//         } else {
//           setError(data.error || "Something went wrong");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err); // Debugging
//         setError("Failed to fetch responses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResponses();
//   }, []);

//   // Toggle collapsible sections
//   const toggleSection = (sectionId: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionId]: !prev[sectionId]
//     }));
//   };

//   // Helper function to render responses in a structured way
//   const renderResponses = (responses: {
//     [key: string]: { [area: string]: string };
//   }) => {
//     return (
//       <div className="space-y-4">
//         {Object.entries(responses).map(([questionId, areas]) =>
//           <div
//             key={questionId}
//             className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
//           >
//             <button
//               onClick={() => toggleSection(`responses-${questionId}`)}
//               className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
//             >
//               <span>
//                 Question {questionId}
//               </span>
//               {expandedSections[`responses-${questionId}`]
//                 ? <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                 : <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
//             </button>
//             {expandedSections[`responses-${questionId}`] &&
//               <table className="w-full text-sm text-gray-700 dark:text-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-2 text-left">Area</th>
//                     <th className="px-4 py-2 text-left">Answer</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(areas).map(([area, answer]) =>
//                     <tr
//                       key={area}
//                       className="border-t border-gray-200 dark:border-gray-600"
//                     >
//                       <td className="px-4 py-2">
//                         {area}
//                       </td>
//                       <td className="px-4 py-2">
//                         {answer}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Helper function to render sub-responses in a structured way
//   const renderSubResponses = (subResponses: { [key: string]: string }) => {
//     return (
//       <div className="space-y-4">
//         {Object.entries(subResponses).map(([key, value]) =>
//           <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//             <button
//               onClick={() => toggleSection(`subResponses-${key}`)}
//               className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
//             >
//               <span>
//                 Sub-Response for {key}
//               </span>
//               {expandedSections[`subResponses-${key}`]
//                 ? <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                 : <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
//             </button>
//             {expandedSections[`subResponses-${key}`] &&
//               <p className="text-sm text-gray-700 dark:text-gray-200">
//                 {value}
//               </p>}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded-md max-w-md">
//           <p>
//             {error}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       {/* Top Bar */}
//       <header className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-md px-4 lg:px-8 py-4 rounded-bl-xl">
//         <div className="flex items-center gap-4" />
//         <div className="flex items-center gap-4 lg:gap-6">
//           {/* Dark Mode Toggle Button */}
//           <button
//             aria-label="Toggle dark mode"
//             onClick={() => setIsDarkMode(!isDarkMode)}
//             className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition"
//           >
//             {isDarkMode
//               ? <SunIcon className="w-6 h-6" />
//               : <MoonIcon className="w-6 h-6" />}
//           </button>

//           <div className="relative hidden lg:block">
//             <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
//             />
//           </div>
//           <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition">
//             <BellIcon className="w-6 h-6" />
//           </button>

//           <button
//             onClick={() => router.push("/settings")}
//             className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition"
//           >
//             <CogIcon className="w-6 h-6" />
//           </button>
//           <button
//             onClick={() => router.push("/national-level/signup")}
//             className="bg-red-500 text-white px-4 lg:px-5 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
//           >
//             <HomeIcon className="w-5 h-5" />
//             <span className="hidden lg:inline">Home</span>
//           </button>
//         </div>
//       </header>

//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
//           Your Responses
//         </h1>

//         {responses.length === 0
//           ? <div className="text-center text-gray-600 dark:text-gray-400">
//               <p>No responses found.</p>
//             </div>
//           : <div className="space-y-6">
//               {responses.map(response =>
//                 <div
//                   key={response._id}
//                   className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
//                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                       Response ID:{" "}
//                       <span className="text-blue-600 dark:text-blue-400">
//                         {response._id}
//                       </span>
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       User ID: {response.userId}
//                     </p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Timestamp: {new Date(response.timestamp).toLocaleString()}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
//                         Responses
//                       </h4>
//                       {renderResponses(response.responses)}
//                     </div>

//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
//                         Sub-Responses
//                       </h4>
//                       {renderSubResponses(response.subResponses)}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>}
//       </div>
//     </div>
//   );
// };

// export default ResponsesPage;

//------------------------------
//=================-----------
//---------------------------
"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import {
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CogIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface Response {
  _id: string;
  userId: string;
  userName: string;
  collection: string;
  responses: { [key: string]: { [area: string]: string } };
  subResponses: { [key: string]: string };
  timestamp: string;
}

const ResponsesPage: NextPage = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedCollection, setSelectedCollection] = useState<string>("All");
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();

  // Initialize dark mode based on system preference or saved preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;

    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply dark mode class to <html> element
  useEffect(
    () => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Save preference to localStorage
      localStorage.setItem("darkMode", isDarkMode.toString());
    },
    [isDarkMode]
  );

  // Fetch responses from the API
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch("/api/getNational");
        const data = await res.json();
        if (res.ok) {
          setResponses(data.responses);
          setFilteredResponses(data.responses);
          setUserName(data.userName || "User");
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to fetch responses");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  // Filter responses based on the selected collection
  useEffect(
    () => {
      if (selectedCollection === "All") {
        setFilteredResponses(responses);
      } else {
        setFilteredResponses(
          responses.filter(
            response => response.collection === selectedCollection
          )
        );
      }
    },
    [selectedCollection, responses]
  );

  // Toggle collapsible sections
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Render responses in a structured way
  const renderResponses = (responses: {
    [key: string]: { [area: string]: string };
  }) => {
    return (
      <div className="space-y-4">
        {Object.entries(responses).map(([questionId, areas]) =>
          <div
            key={questionId}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <button
              onClick={() => toggleSection(`responses-${questionId}`)}
              className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              <span>
                Question {questionId}
              </span>
              {expandedSections[`responses-${questionId}`]
                ? <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                : <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
            </button>
            {expandedSections[`responses-${questionId}`] &&
              <table className="w-full text-sm text-gray-700 dark:text-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Area</th>
                    <th className="px-4 py-2 text-left">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(areas).map(([area, answer]) =>
                    <tr
                      key={area}
                      className="border-t border-gray-200 dark:border-gray-600"
                    >
                      <td className="px-4 py-2">
                        {area}
                      </td>
                      <td className="px-4 py-2">
                        {answer}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>}
          </div>
        )}
      </div>
    );
  };

  // Render sub-responses in a structured way
  const renderSubResponses = (subResponses: { [key: string]: string }) => {
    return (
      <div className="space-y-4">
        {Object.entries(subResponses).map(([key, value]) =>
          <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <button
              onClick={() => toggleSection(`subResponses-${key}`)}
              className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              <span>
                Sub-Response for {key}
              </span>
              {expandedSections[`subResponses-${key}`]
                ? <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                : <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
            </button>
            {expandedSections[`subResponses-${key}`] &&
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {value}
              </p>}
          </div>
        )}
      </div>
    );
  };

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
      <header className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-md px-4 lg:px-8 py-4 rounded-bl-xl">
        <div className="flex items-center gap-4" />
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Dark Mode Toggle Button */}
          <button
            aria-label="Toggle dark mode"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition"
          >
            {isDarkMode
              ? <SunIcon className="w-6 h-6" />
              : <MoonIcon className="w-6 h-6" />}
          </button>

          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Notification and Settings Icons */}
          <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition">
            <BellIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition"
          >
            <CogIcon className="w-6 h-6" />
          </button>

          {/* Home Button */}
          <button
            onClick={() => router.push("/national-level/signup")}
            className="bg-red-500 text-white px-4 lg:px-5 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="hidden lg:inline">Home</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {userName}'s Responses
        </h1>

        {/* Collection Filter Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="collection-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Collection:
          </label>
          <select
            id="collection-select"
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="All">All</option>
            <option value="data collection national">Data Collection</option>
            <option value="data ownership and management national">
              Data Ownership
            </option>
            <option value="data openness and flow national">
              Data Openness
            </option>
            <option value="data quality national">Data Quality</option>
            <option value="data use national">Data Use</option>
          </select>
        </div>

        {/* Display Responses */}
        {filteredResponses.length === 0
          ? <div className="text-center text-gray-600 dark:text-gray-400">
              <p>No responses found.</p>
            </div>
          : <div className="space-y-6">
              {filteredResponses.map(response =>
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
                      Collection: {response.collection}
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
                      {renderResponses(response.responses)}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Sub-Responses
                      </h4>
                      {renderSubResponses(response.subResponses)}
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
