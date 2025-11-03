"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // no redirect this time — we allow access to guests too

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Case 1: User is logged in */}
      {user ? (
        <div>
          <p className="text-gray-700 mb-2">
            Welcome back, <strong>{user.name || user.email}</strong>!
          </p>
          <p className="text-gray-600">
            You are logged in as <strong>{user.role}</strong>.
          </p>

          {user.role === "ADMIN" ? (
            <p className="mt-4 text-blue-600 font-medium">
              Access admin features from your Admin Panel.
            </p>
          ) : (
            <p className="mt-4 text-green-600 font-medium">
              Explore your personal reading list and recommendations.
            </p>
          )}
        </div>
      ) : (
        /* Case 2: Guest user */
        <div>
          <p className="text-gray-700">
            Welcome to your Dashboard 👋  
            Please{" "}
            <button
              onClick={() => router.push("/signin")}
              className="text-blue-600 underline"
            >
              Sign in
            </button>{" "}
            or{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-600 underline"
            >
              Sign up
            </button>{" "}
            to unlock your personalized experience.
          </p>

          <p className="mt-4 text-gray-500">
            For now, you can still browse public content like book previews,
            community picks, or top recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
