"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Navigation from "../Navigation";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";

// DTO Types
export interface BankAccountOutputDto {
  id: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranchCode: string;
  isConfirmed: boolean;
  studentNumber: string;
  dataConfirmedById: string;
  updatedAt: string;
}

export interface BankAccountInputDto {
  id?: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranchCode: string;
  studentNumber: string;
  dataConfirmedById?: string;
}

export interface BankAccountUpdateDto {
  bankAccountNumber: string;
  bankName: string;
  bankBranchCode: string;
  isConfirmed: boolean;
  studentNumber: string;
  dataConfirmedById?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_CORE_API_URL + "BankAccountContracts";

export default function BankAccountPage() {
  const [accounts, setAccounts] = useState<BankAccountOutputDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { studentNumber, userId } = useAuth();
  const [isFraud, setIsFraud] = useState(false);
  // Fetch all accounts
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/${studentNumber}`);
      let data: BankAccountOutputDto = res.data;
      data.updatedAt = convertToUtcPlus2(res.data.updatedAt).toLocaleString();
      setAccounts(data);
      if (userId === data.dataConfirmedById) {
        setIsFraud(false);
      } else if (data.dataConfirmedById !== null && userId !== data.dataConfirmedById) {
        setIsFraud(true);
      }
      console.log("Fetched accounts:", data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function convertToUtcPlus2(dateString: string): Date {
    // Split the string into date and time components.
    const [datePart, timePart] = dateString.split(" ");

    // Split the date part into year, month, and day.
    const [year, month, day] = datePart.split("/").map(Number);

    // Split the time part into hours and minutes.
    const [hours, minutes] = timePart.split(":").map(Number);

    // Create a new Date object assuming the input is UTC time.
    // Note: The month argument is 0-indexed.
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    // Add 2 hours (2 * 60 * 60 * 1000 milliseconds) to the UTC date.
    const utcPlus2Time = utcDate.getTime(); //+ (1 * 60 * 60 * 1000);

    // Create a new Date object from the adjusted time.
    const newDate = new Date(utcPlus2Time);

    return newDate;
  }

  const confirmDetails = async () => {
    try {
      const res = await axios.put(`${API_BASE}/confirm`, {
        accountNumber: accounts?.bankAccountNumber,
        userId: userId,
        isConfirmed: true,
      });
      if (res.status === 200) {
        alert("Details confirmed successfully");
        fetchAccounts();
      }
    } catch (err: any) {
      alert(`Error occured while confirming bank details: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="pt-5 flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <RequireAuth>
        <div className="p-8 text-xl">
          <div className="text-xl font-bold mb-2">Bank Account Overview</div>
        </div>
        <div className="mt-6 max-w-6xl mx-auto flex flex-col items-center gap-2 w-full">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          <button onClick={fetchAccounts} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 mb-4 self-end">
            Refresh
          </button>
          {accounts?.isConfirmed && (
            <p className="bg-white text-black mb-5 font-semibold px-4 rounded-sm">
              Data was confirmed by{" "}
              {isFraud ? "Someone else. Fraud detected. Contact admin" : "You. You can expect a payment on the next pay date"}
            </p>
          )}
          {!accounts?.isConfirmed && (
            <p className="text-red-500 mb-5 bg-white rounded-md px-3 py-1 font-semibold">
              Data not confirmed. You won't be paid on the next pay date. Please click on the confirm to start the process
            </p>
          )}
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse rounded-xl shadow-lg bg-white dark:bg-gray-900 text-sm">
              <thead className="bg-blue-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border-b text-start">Account #</th>
                  <th className="px-4 py-2 border-b text-start">Bank</th>
                  <th className="px-4 py-2 border-b text-start">Branch</th>
                  <th className="px-4 py-2 border-b text-start">Student #</th>
                  <th className="px-4 py-2 border-b text-start">Confirmed</th>
                  <th className="px-4 py-2 border-b text-start">Updated</th>
                </tr>
              </thead>
              <tbody className="text-start">
                {!accounts && (
                  <tr>
                    <td colSpan={6} className="py-6 text-gray-400">
                      No bank account record found.
                    </td>
                  </tr>
                )}
                {accounts && (
                  <tr key={accounts.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                    <td className="border-b px-4 py-2">{accounts.bankAccountNumber}</td>
                    <td className="border-b px-4 py-2">{accounts.bankName}</td>
                    <td className="border-b px-4 py-2">{accounts.bankBranchCode}</td>
                    <td className="border-b px-4 py-2">{accounts.studentNumber}</td>
                    <td className="border-b px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          accounts.isConfirmed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {accounts.isConfirmed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="border-b px-4 py-2">{accounts.updatedAt}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!accounts?.isConfirmed && (
            <button
              onClick={confirmDetails}
              className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-gray-800 hover:font-semibold hover:outline-blue-500 mt-4 self-end"
            >
              Confirm Payment Details
            </button>
          )}
        </div>
      </RequireAuth>
    </div>
  );
}