"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { redirect, useRouter } from "next/navigation";
import { json } from "stream/consumers";


// Possible roles: "user", "admin", or null (not logged in)
interface AuthContextType {
  role: "user" | "admin" | null;
  isLogin: boolean;
  username: string | null;
  studentNumber?: string | null;
  userId?: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [studentNumber, setStudentNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedIsLogin = localStorage.getItem("isLogin");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedRole && storedIsLogin === "true") {
      setRole(storedRole as "user" | "admin");
      setIsLogin(true);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }
  }, []);

  const tempLogin = () => {
    setRole("user");
    setIsLogin(true);
    setUsername("Nandos");
    localStorage.setItem("role", "user");
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("username", "Nandos");
  };

  const login = async (username: string, password: string) => {
    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_CORE_API_URL);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_CORE_API_URL}auth/login`, {
        username: username,
        password: password
    });
      if (res.status === 200) {

        if(res.data.isLoginSuccessful){
          console.log("Login successful:", res.data);
          console.log("user id: ", res.data.id);
          setRole(res.data.role);
          setIsLogin(true);
          setUsername(username);
          setStudentNumber(res.data.studentNumber);
          setUserId(res.data.id);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("studentNumber", res.data.studentNumber);
          localStorage.setItem("userId", res.data.id);
          router.push("/");
        }
        
      } 
    } catch (error) {
      //   setRole(null);
      //   setIsLogin(false);
      //   alert("Login failed. Please try again.");
      alert(`Error: ${(error as any).message}`);
    }
  };

  const logout = () => {
    setRole(null);
    setIsLogin(false);
    setUsername(null);
    setStudentNumber(null);
    setUserId(null);
    localStorage.removeItem("role");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("studentNumber");
    localStorage.removeItem("userId");
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ role, isLogin, username, studentNumber, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
