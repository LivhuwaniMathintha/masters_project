"use client"
import { useAuth } from "./AuthContext";
import { notFound } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLogin} = useAuth();
  if (!isLogin) {
    notFound(); // This will show the Next.js 404/401 page
  }
  return <>{children}</>;
}
