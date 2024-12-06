"use client";
import { useMemo,useEffect, useState } from "react";

interface ScoreData {
  area: string;
  totalScore: number;
}

interface ApiResponse {
  success: boolean;
  data: ScoreData[];
  error?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiEndpoints = useMemo(() => [
    { collectionName: "Data Collection", url: "/api/getData" },
    { collectionName: "Data Ownership and Management", url: "/api/getDataOwnershipAndManagement" },
    { collectionName: "Data Openness and Flow", url: "/api/getDataOpenessAndFlow" },
    { collectionName: "Data Quality", url: "/api/getDataQuality" },
    { collectionName: "Data Use", url: "/api/getDataUse" },
  ], []);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const allData: { [key: string]: { [key: string]: number } } = {};
        const allAreas = new Set<string>();

        for (const { collectionName, url } of apiEndpoints) {
          const response = await fetch(url);
          const result: ApiResponse = await response.json();

          if (result.success) {
            allData[collectionName] = {};
            result.data.forEach((item) => {
              allData[collectionName][item.area] = item.totalScore;
              allAreas.add(item.area);
            });
          } else {
            setError(result.error || "Failed to fetch data");
          }
        }

        setData(allData);
        setAreas(Array.from(allAreas)); // Ensure unique areas
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [apiEndpoints]);

  const getScoreClass = (score: number) => {
    if (score >= 80) return "bg-green-600 text-white"; // Bright green
    if (score >= 50) return "bg-orange-600 text-white"; // Bright orange
    return "bg-red-600 text-white"; // Bright red
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Data Maturity Assessment Dashboard</h1>
      <h1 className="text-xl text-gray-900 text-center mb-4">Respondent: Alinafe</h1>
      <h2 className="text-lg text-gray-900 text-center mb-6">Organisation: ESAWAS</h2>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="w-full bg-white border-spacing-0 border-separate">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase">
              <th className="px-6 py-3 text-left font-semibold rounded-tl-lg border-r border-blue-600">Collection</th>
              {areas.map((area, index) => (
                <th
                  key={area}
                  className={`px-6 py-3 text-left ${
                    index === areas.length - 1 ? "rounded-tr-lg" : ""
                  } border-l border-blue-600`}
                >
                  {area}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((collection, rowIndex) => (
              <tr key={collection} className={`${rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <td className="px-6 py-3 font-semibold text-gray-800 border border-gray-300">{collection}</td>
                {areas.map((area) => (
                  <td
                    key={area}
                    className={`px-6 py-3 text-center border border-gray-300 ${getScoreClass(
                      data[collection][area] || 0
                    )} hover:scale-105 transition-all duration-300`}
                  >
                    {data[collection][area]?.toFixed(2) || "N/A"}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
