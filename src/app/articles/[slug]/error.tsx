"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong .... </h2>
      
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-red-600 text-white rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}