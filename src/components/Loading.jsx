export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

        {/* Message */}
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
