import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { OrdemManutencao } from '../../types';

interface HistoricoManutencaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipamentoId: string | null;
}

export const HistoricoManutencaoModal: React.FC<HistoricoManutencaoModalProps> = ({ isOpen, onClose, equipamentoId }) => {
  const [ordens, setOrdens] = useState<OrdemManutencao[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && equipamentoId) {
      fetchHistorico();
    }
  }, [isOpen, equipamentoId]);

  const fetchHistorico = async () => {
    setLoading(true);
    const [
      { data: ordensData, error: oError },
      { data: tipos, error: tError },
      { data: status, error: sError },
      { data: profiles, error: pError }
    ] = await Promise.all([
      supabase.from('ordens_manutencao').select('*').eq('equipamento_id', equipamentoId),
      supabase.from('tipos_manutencao').select('id, nome'),
      supabase.from('status_ordem').select('id, nome'),
      supabase.from('profiles').select('id, name, surname')
    ]);

    if (oError) {
      console.error('Error fetching ordens:', oError);
      setLoading(false);
      return;
    }

    if (ordensData) {
      const mapped = ordensData.map((item: any) => {
        const tipo = tipos?.find((t: any) => t.id === item.tipo_id);
        const stat = status?.find((s: any) => s.id === item.status_id);
        const prof = profiles?.find((p: any) => p.id === item.tecnico_id);
        
        return {
          ...item,
          tipo: tipo?.nome || '',
          status: stat?.nome || '',
          tecnico: prof ? `${prof.name} ${prof.surname}`.trim() : ''
        };
      });
      setOrdens(mapped);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl p-6 shadow-xl relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800 mb-6">Histórico de Manutenção</h2>
        
        {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin" size={32} /></div>
        ) : (
            <table className="w-full text-sm text-left border">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-4 py-2">Data</th>
                        <th className="px-4 py-2">Tipo</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Técnico</th>
                        <th className="px-4 py-2">Observações</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {ordens.map(ordem => (
                        <tr key={ordem.id}>
                            <td className="px-4 py-2">{new Date(ordem.data_inicio).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{ordem.tipo}</td>
                            <td className="px-4 py-2">{ordem.status}</td>
                            <td className="px-4 py-2">{ordem.tecnico}</td>
                            <td className="px-4 py-2">{ordem.observacoes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
};
