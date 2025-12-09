"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        // No valid session, user stays null
        console.log("No active session");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  async function signup(payload) {
    try {
      const res = await api.post("/auth/signup", payload);
      setUser(res.data.user || null);
      router.push("/");
      return res.data;
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Signup failed";
      throw new Error(errorMessage);
    }
  }

  async function signin(payload) {
    // payload: { email, password }
    const res = await api.post("/auth/login", payload).catch((err) => {
      throw err.response?.data || { message: "login failed" };
    });

    setUser(res.data.user || null);
    router.push("/");
    return res.data;
  }

  async function logout(){
    await api.post("/auth/logout").catch(()=>{})
    setUser(null)
    router.push("/signin")
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signup, signin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(){
    return useContext(AuthContext)
}