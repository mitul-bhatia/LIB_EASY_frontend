import { Alert, AlertDescription } from "@/components/ui/alert";
import { isSuccessMessage } from "@/lib/helpers";

// Wrapper around shadcn Alert for success/error messages
export default function Message({ message, onClose }) {
  if (!message) return null;

  const isSuccess = isSuccessMessage(message);

  return (
    <Alert 
      className={`mb-4 ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
    >
      <div className="flex justify-between items-center">
        <AlertDescription className={isSuccess ? 'text-green-700' : 'text-red-700'}>
          {message}
        </AlertDescription>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-70"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </Alert>
  );
}
