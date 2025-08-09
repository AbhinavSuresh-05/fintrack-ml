// Loading Skeleton Components for better UX

export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse ${className}`}>
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const SkeletonChart = ({ className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const SkeletonTransaction = ({ className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 animate-pulse ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export const SkeletonTransactionList = ({ count = 5, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
    </div>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonTransaction key={index} />
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>

      {/* Tab navigation skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="flex space-x-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          ))}
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SkeletonCard className="h-96" />
        </div>
        <div className="lg:col-span-2">
          <SkeletonTransactionList />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonButton = ({ className = "" }) => (
  <div className={`h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
);

export const SkeletonInput = ({ className = "" }) => (
  <div className={`h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
);

export const SkeletonText = ({ className = "", lines = 1 }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    ))}
  </div>
);
