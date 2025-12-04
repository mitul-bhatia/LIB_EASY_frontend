"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function AddMember() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    userFullName: "",
    memberId: "",
    mobileNumber: "",
    email: "",
    password: "",
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRecentMembers();
  }, []);

  const fetchRecentMembers = async () => {
    try {
      const res = await api.get("/users/allmembers");
      setRecentMembers(res.data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch recent members:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Validate required fields
    if (
      !form.userFullName ||
      !form.mobileNumber ||
      !form.email ||
      !form.password
    ) {
      setMessage("All fields must be filled");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        userFullName: form.userFullName,
        memberId: form.memberId || undefined,
        mobileNumber: form.mobileNumber,
        email: form.email,
        password: form.password,
        isAdmin: isAdmin,
      };

      const res = await api.post("/auth/signup", payload);
      setMessage("Member added successfully!");
      
      // Update recent members
      setRecentMembers([res.data.user, ...recentMembers.slice(0, 4)]);

      // Clear form
      setForm({
        userFullName: "",
        memberId: "",
        mobileNumber: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Add New Member</h2>
      
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Role *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
                  !isAdmin
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
                  isAdmin
                    ? "bg-red-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={form.userFullName}
              onChange={(e) => setForm({ ...form, userFullName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Member ID */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Member ID (Optional)
            </label>
            <input
              type="text"
              value={form.memberId}
              onChange={(e) => setForm({ ...form, memberId: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., MEM001"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              minLength={6}
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`px-4 py-3 rounded-md border text-sm ${
                message.includes("success")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-md font-medium text-white text-sm transition-colors ${
              isLoading
                ? "bg-zinc-400 cursor-not-allowed"
                : isAdmin
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Adding..." : `Add ${isAdmin ? "Admin" : "Student"}`}
          </button>
        </form>
      </div>

      {/* Recently Added Members */}
      {recentMembers.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-zinc-900 mb-3">Recently Added Members</h3>
          <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Member ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentMembers.map((member, index) => (
                  <tr key={member.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-zinc-500">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                        member.isAdmin 
                          ? "bg-red-50 text-red-700 border-red-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {member.isAdmin ? "Admin" : "Student"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600">
                      {member.memberId || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{member.userFullName}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
