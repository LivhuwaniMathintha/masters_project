"use client";

import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  // const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      var res = await login(username, password);
      //router.push("/");
    } catch (err: any) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <div className="flex justify-between items-center gap-5">

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
          disabled={loading}
          >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full" onClick={() => {router.push("/")}}>Cancel</button>
          </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
      <p className="text-gray-500 text-sm mt-2">Registration is managed by admin only.</p>
    </div>
  );
}
