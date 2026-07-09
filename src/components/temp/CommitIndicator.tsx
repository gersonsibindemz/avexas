import React, { useEffect, useState } from 'react';

export const CommitIndicator: React.FC = () => {
  const [info, setInfo] = useState<{ date: string; message: string } | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/gersonsibindemz/avexas/commits?per_page=1')
      .then(res => res.json())
      .then(data => {
        if (!data || !data[0]) return;
        const commit = data[0].commit;
        // Maputo is UTC+2
        const date = new Date(commit.committer.date);
        const maputoDate = new Date(date.getTime() + (2 * 60 * 60 * 1000));
        setInfo({
          date: maputoDate.toLocaleString('pt-MZ', { timeZone: 'Africa/Maputo', hour12: false }),
          message: commit.message
        });
      })
      .catch(console.error);
  }, []);

  if (!info) return null;

  return (
    <div className="px-4 py-1 text-[10px] text-slate-500 bg-white border-b border-sky-100">
      Última atualização (Maputo): {info.date} | Commit: {info.message}
    </div>
  );
};
