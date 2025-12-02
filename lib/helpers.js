// Simple helper functions for the app

const FINE_PER_DAY = 10;

// Calculate fine for overdue books ($10 per day)
export function calculateFine(dueDate) {
  const currentDate = new Date();
  const due = new Date(dueDate);
  const daysOverdue = Math.floor((currentDate - due) / (1000 * 60 * 60 * 24));
  
  return daysOverdue > 0 ? daysOverdue * FINE_PER_DAY : 0;
}

// Get number of days between two dates
export function calculateDuration(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
  
  return days > 0 ? days : 0;
}

// Get today's date in YYYY-MM-DD format (for date inputs)
export function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

// Get future date in YYYY-MM-DD format
export function getFutureDateISO(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// Check if message is success or error (for styling)
export function isSuccessMessage(message) {
  const successWords = ["success", "approved", "issued", "cancelled"];
  return successWords.some(word => message.toLowerCase().includes(word));
}

// Get Tailwind classes for message
export function getMessageClasses(message) {
  return isSuccessMessage(message)
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
}
