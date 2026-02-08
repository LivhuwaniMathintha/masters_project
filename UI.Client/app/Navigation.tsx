"use client";
import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function Navigation() {
  const { role, isLogin, username, logout } = useAuth();

  return (
    <div className="w-full flex flex-col items-center">
      {isLogin && (
        <div className="mb-4 font-semibold text-sm text-gray-800 dark:text-gray-100 drop-shadow-sm flex place-content-start w-full max-w-6xl">
          Hello, {username ? username : role === "admin" ? "Admin" : "User"}!
        </div>
      )}
      <div
        className="backdrop-blur-sm bg-white/70 dark:bg-black/40 rounded-xl shadow-md px-6 py-3 flex items-center border border-white/20 dark:border-black/30 max-w-6xl w-full"
        style={{
          boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.10)",
        }}
      >
        <div className='font-bold text-md tracking-widest'>BLOCKIFINAID</div>
        <nav className="flex gap-3 items-center flex-wrap justify-center mx-auto">

          {!role && (
            <Link href="/login" className="font-medium text-white dark:text-white hover:underline transition-all duration-150 px-3 py-1 rounded-lg hover:bg-blue-100/60 dark:hover:bg-blue-900/30 ml-auto">
              Login
            </Link>
          )}
          {role && (
            <>
              <Link href="/bank-account" className="font-medium nav-link">Bank Account</Link>
              <Link href="/funding" className="font-medium nav-link">Funding</Link>
              {role === "admin" && (
                <Link href="http://localhost:3000/d/c51ea729-4ee4-4eb0-8515-a2857711b7b5/payments-dashboard-2" className="font-medium nav-link">Dashboard</Link>
              )}
              <button
                onClick={logout}
                className="font-medium text-red-600 dark:text-red-400 hover:underline px-3 py-1 rounded-lg hover:bg-red-100/60 dark:hover:bg-red-900/30 transition-all duration-150"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
      <style jsx global>{`
        .nav-link {
          color: #fff;
          background: none;
          border-radius: 1rem;
          padding: 0.5rem 1rem;
          transition: background 0.2s, color 0.2s;
        }
        .dark .nav-link {
          color: #fff;
          background: none;
        }
        .nav-link:hover {
          background: none;
          color: #0a58ca;
        }
        .dark .nav-link:hover {
          background: none;
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
}
