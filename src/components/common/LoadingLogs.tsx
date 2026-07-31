import React from 'react';

interface LoadingLogsProps {
  logs: string[];
}

export function LoadingLogs({ logs }: LoadingLogsProps) {
  return (
    <div className="bg-slate-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
      {logs.map((log, index) => (
        <div key={index}>{`> ${log}`}</div>
      ))}
    </div>
  );
}
