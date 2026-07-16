export default function PageLoader() {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600"></div>
  
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }