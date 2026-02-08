"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import Navigation from "../Navigation";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";

// DTO Types
export interface FundingOutputDto {
  id: string;
  funderId: string;
  funder: string;
  studentId: string;
  funderContractConditionId: string;
  dataConfirmedById: string;
  signedOn: string;
  isActive: boolean;
  foodBalance: number;
  tuitionBalance: number;
  laptopBalance: number;
  accommodationBalance: number;
  modifiedBy: string;
  updatedAt: string;
  paymentDate: string
}

const API_BASE = process.env.NEXT_PUBLIC_CORE_API_URL + "FundingContracts";

export default function FundingPage() {
  const [fundings, setFundings] = useState<FundingOutputDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  // Fetch fundings by studentId
  const fetchFundings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/${userId}`);
      console.log(res.data);
      setFundings(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFundings();
  }, [userId]);

  return (
    <div className="pt-5 flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <RequireAuth>
        <div className="p-8 text-xl">
          <div className="text-xl font-bold mb-2">Funding Overview</div>
        </div>
        <div className="mt-6 max-w-90/100 mx-auto flex flex-col items-center gap-2 w-full">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          <button onClick={fetchFundings} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 mb-4 self-end">Refresh</button>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse rounded-xl shadow-lg bg-white dark:bg-gray-900 text-sm">
              <thead className="bg-blue-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border-b text-start">Funder</th>
                  <th className="px-4 py-2 border-b text-start">Signed On</th>
                  <th className="px-4 py-2 border-b text-start">Next Payment</th>
                  <th className="px-4 py-2 border-b text-start">Active</th>
                  <th className="px-4 py-2 border-b text-start">Food Balance</th>
                  <th className="px-4 py-2 border-b text-start">Tuition Balance</th>
                  <th className="px-4 py-2 border-b text-start">Laptop Balance</th>
                  <th className="px-4 py-2 border-b text-start">Accommodation Balance</th>
                  <th className="px-4 py-2 border-b text-start">Confirmed By</th>
                  <th className="px-4 py-2 border-b text-start">Last Updated</th>
                  <th className="px-4 py-2 border-b text-start">Modified By</th>
                </tr>
              </thead>
              <tbody className="text-start">
                {fundings.length === 0 && (
                  <tr><td colSpan={10} className="py-6 text-gray-400">No funding records found.</td></tr>
                )}
                {fundings.map(funding => (
                  <tr key={funding.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                    <td className="border-b px-4 py-2">{funding.funder}</td>
                    <td className="border-b px-4 py-2">{funding.signedOn ? new Date(funding.signedOn).toLocaleDateString() : "-"}</td>
                     <td className="border-b px-4 py-2">{funding.paymentDate}</td>
                    <td className="border-b px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${funding.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {funding.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="border-b px-4 py-2">R {funding.foodBalance.toLocaleString()}</td>
                    <td className="border-b px-4 py-2">R {funding.tuitionBalance.toLocaleString()}</td>
                    <td className="border-b px-4 py-2">R {funding.laptopBalance.toLocaleString()}</td>
                    <td className="border-b px-4 py-2">R {funding.accommodationBalance.toLocaleString()}</td>
                    <td className="border-b px-4 py-2">{funding.dataConfirmedById}</td>
                    <td className="border-b px-4 py-2">{funding.updatedAt}</td>
                    <td className="border-b px-4 py-2">{funding.modifiedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </RequireAuth>
    </div>
  );
}