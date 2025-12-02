"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function RequestBookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId;

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (user.isAdmin) {
      setError("Admins cannot request books. Please use the Issue/Reserve feature in admin dashboard.");
      setTimeout(() => router.push("/books"), 2000);
      return;
    }

    fetchBook();
    
    // Set default dates
    const today = new Date().toISOString().split("T")[0];
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    setFromDate(today);
    setToDate(twoWeeksLater);
  }, [user, bookId, router]);

  const fetchBook = async () => {
    try {
      const res = await api.get("/books/allbooks");
      const foundBook = res.data.find((b) => b.id === bookId);
      if (!foundBook) {
        setError("Book not found");
        return;
      }
      setBook(foundBook);
    } catch (err) {
      setError("Failed to load book details");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate dates
    if (!fromDate || !toDate) {
      setError("Please select both dates");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to <= from) {
      setError("To date must be after from date");
      return;
    }

    const duration = calculateDuration();
    if (duration < 1) {
      setError("Duration must be at least 1 day");
      return;
    }

    if (duration > 90) {
      setError("Maximum duration is 90 days");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/transactions/request-book", {
        bookId: book.id,
        userId: user.id,
        fromDate,
        toDate,
      });

      setSuccess(res.data.message || "Book request submitted successfully!");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Book not found"}</p>
          <button
            onClick={() => router.push("/books")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/books")}
            className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2"
          >
            ← Back to Books
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Request Book</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details to request this book
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Details Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Book Details
            </h2>

            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-semibold text-lg">{book.bookName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Author</p>
                <p className="font-medium">{book.author}</p>
              </div>

              {book.publisher && (
                <div>
                  <p className="text-sm text-gray-600">Publisher</p>
                  <p className="font-medium">{book.publisher}</p>
                </div>
              )}

              {book.language && (
                <div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Availability</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.bookCountAvailable > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.bookCountAvailable > 0 ? "Available" : "Unavailable"}
                  </span>
                  <span className="text-sm text-gray-600">
                    {book.bookCountAvailable} copies
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Request Details
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When do you want to borrow this book?
                </p>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When will you return this book?
                </p>
              </div>

              {/* Duration Display */}
              {fromDate && toDate && calculateDuration() > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      Total Duration
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateDuration()} days
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Fine: $10 per day if returned late
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Note:</span> Your request will
                  be reviewed by an admin. You'll be notified once it's
                  approved.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/books")}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
