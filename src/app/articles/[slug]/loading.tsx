export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-6" />

      <div className="h-4 bg-gray-200 rounded w-1/3 mb-10" />

      <div className="h-[300px] bg-gray-200 rounded-xl mb-8" />

      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}