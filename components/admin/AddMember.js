"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function AddMember() {
  const [userType, setUserType] = useState("Student");
  const [form, setForm] = useState({
    userFullName: "",
    admissionId: "",
    employeeId: "",
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

    if (userType === "Student" && !form.admissionId) {
      setMessage("Admission ID is required for students");
      setIsLoading(false);
      return;
    }

    if (userType === "Staff" && !form.employeeId) {
      setMessage("Employee ID is required for staff");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        userType,
        userFullName: form.userFullName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        password: form.password,
        isAdmin: false,
      };

      if (userType === "Student") {
        payload.admissionId = form.admissionId;
      } else {
        payload.employeeId = form.employeeId;
      }

      const res = await api.post("/auth/signup", payload);
      setMessage("Member added successfully!");
      
      // Update recent members
      setRecentMembers([res.data.user, ...recentMembers.slice(0, 4)]);

      // Clear form
      setForm({
        userFullName: "",
        admissionId: "",
        employeeId: "",
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType("Student")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  userType === "Student"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType("Staff")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  userType === "Staff"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Staff
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={form.userFullName}
              onChange={(e) => setForm({ ...form, userFullName: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* ID Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {userType === "Student" ? "Admission ID *" : "Employee ID *"}
            </label>
            <input
              type="text"
              value={userType === "Student" ? form.admissionId : form.employeeId}
              onChange={(e) =>
                setForm({
                  ...form,
                  [userType === "Student" ? "admissionId" : "employeeId"]: e.target.value,
                })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              minLength={6}
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Adding Member..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* Recently Added Members */}
      {recentMembers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recently Added Members</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Member Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Member ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Member Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((member, index) => (
                  <tr key={member.id} className="border-t">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{member.userType}</td>
                    <td className="px-4 py-2 text-sm">
                      {member.admissionId || member.employeeId}
                    </td>
                    <td className="px-4 py-2 text-sm">{member.userFullName}</td>
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
