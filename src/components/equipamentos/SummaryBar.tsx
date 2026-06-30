import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface SummaryBarProps {
  table: 'equipamentos' | 'componentes';
  activeStatus?: string | null;
  onFilterClick?: () => void;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({ table, activeStatus, onFilterClick }) => {
  const [data, setData] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      
      let query = supabase.from(table).select('status');
      if (activeStatus) {
        query = query.eq('status', activeStatus);
      }
      
      const { data: records, error } = await query;

      if (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        return;
      }

      if (records) {
        setTotal(records.length);
        const statusCounts = records.reduce((acc, curr) => {
          const status = curr.status || 'Sem Status';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setData(statusCounts);
      }
      setLoading(false);
    };

    fetchCounts();
  }, [table, activeStatus]);

  if (loading) return <div className="p-3 text-sm text-slate-500">Carregando indicadores...</div>;

  return (
    <div className="flex gap-6 p-3 text-xs rounded-none items-center">
      <button onClick={onFilterClick} className={`hover:text-sky-600 ${activeStatus ? 'text-black' : 'text-slate-400'}`}>
        <Filter size={16} className={activeStatus ? 'fill-black' : ''} />
      </button>
      <span className="font-medium text-slate-700">Linhas: <span className="font-bold">{total}</span></span>
      <span className="text-slate-400">|</span>
      {Object.entries(data).map(([status, count]) => (
        <React.Fragment key={status}>
          <span className="font-medium text-slate-600">
            {status}: <span className="font-bold">{count}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
