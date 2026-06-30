import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface SummaryBarProps {
  table: 'equipamentos' | 'componentes';
}

export const SummaryBar: React.FC<SummaryBarProps> = ({ table }) => {
  const [counts, setCounts] = useState({
    total: 0,
    critico: 0,
    ativo: 0,
    manutencao: 0,
    inativo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const statuses = ['Crítico', 'Ativo', 'Manutenção', 'Inativo'];
      
      const countsResult = {
        total: 0,
        critico: 0,
        ativo: 0,
        manutencao: 0,
        inativo: 0,
      };

      // Get Total
      const { count: totalCount } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      countsResult.total = totalCount || 0;

      // Get Specific Statuses
      for (const status of statuses) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        
        if (status === 'Crítico') countsResult.critico = count || 0;
        if (status === 'Ativo') countsResult.ativo = count || 0;
        if (status === 'Manutenção') countsResult.manutencao = count || 0;
        if (status === 'Inativo') countsResult.inativo = count || 0;
      }

      setCounts(countsResult);
      setLoading(false);
    };

    fetchCounts();
  }, [table]);

  if (loading) return <div className="p-3 text-sm text-slate-500">Carregando indicadores...</div>;

  return (
    <div className="flex gap-6 p-3 bg-slate-50 border border-slate-200 text-xs rounded-none">
      <span className="font-medium text-slate-700">Total: <span className="font-bold">{counts.total}</span></span>
      <span className="text-slate-400">|</span>
      <span className="text-red-600 font-medium">Crítico: <span className="font-bold">{counts.critico}</span></span>
      <span className="text-emerald-600 font-medium">Ativo: <span className="font-bold">{counts.ativo}</span></span>
      <span className="text-amber-600 font-medium">Manutenção: <span className="font-bold">{counts.manutencao}</span></span>
      <span className="text-slate-600 font-medium">Inativo: <span className="font-bold">{counts.inativo}</span></span>
    </div>
  );
};
