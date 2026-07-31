import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded"></div>
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded"></div>
    </div>
  );
}
