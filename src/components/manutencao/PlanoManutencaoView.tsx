import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { PlanoManutencao } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { FormCard } from '../common/FormCard';
import { CadastrarPlanoView } from './CadastrarPlanoView';

export const PlanoManutencaoView: React.FC = () => {
  const [planos, setPlanos] = useState<PlanoManutencao[]>([]);
  const [statusOpcoes, setStatusOpcoes] = useState<{id: string, nome: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetchPlanos();
    fetchStatusOpcoes();
  }, []);

  const fetchPlanos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('planos_manutencao')
      .select('*, ordens_manutencao(descricao)');
    
    if (data) {
        setPlanos(data.map((p: any) => ({
            ...p,
            ordem_descricao: p.ordens_manutencao?.descricao
        })));
    }
    setLoading(false);
  };

  const fetchStatusOpcoes = async () => {
    const { data } = await supabase
      .from('status_ordem')
      .select('*');
    if (data) {
        setStatusOpcoes(data);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
        .from('planos_manutencao')
        .update({ status: newStatus })
        .eq('id', id);
    
    if (!error) {
        fetchPlanos();
    } else {
        console.error('Error updating status:', error);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {isRegistering ? (
        <FormCard title="Cadastrar Novo Plano" onClose={() => setIsRegistering(false)}>
          <CadastrarPlanoView onCancel={() => setIsRegistering(false)} onSave={() => { setIsRegistering(false); fetchPlanos(); }} />
        </FormCard>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Planos de Manutenção</h2>
            <button onClick={() => setIsRegistering(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 hover:bg-sky-700">
              <Plus size={18} /> Novo Plano
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="bg-white border border-slate-200">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-3 text-left">Título</th>
                            <th className="p-3 text-left">Ordem</th>
                            <th className="p-3 text-left">Descrição</th>
                            <th className="p-3 text-left">Data de Início</th>
                            <th className="p-3 text-left">Data de Fim</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planos.map(plano => (
                            <tr key={plano.id} className="border-b border-slate-100">
                                <td className="p-3">{plano.titulo || 'N/A'}</td>
                                <td className="p-3">{plano.ordem_descricao || 'N/A'}</td>
                                <td className="p-3">{plano.descricao}</td>
                                <td className="p-3">{plano.data_inicio}</td>
                                <td className="p-3">{plano.data_fim}</td>
                                <td className="p-3">
                                    <select 
                                        value={plano.status} 
                                        onChange={(e) => handleStatusChange(plano.id, e.target.value)}
                                        className="border p-1 rounded capitalize"
                                    >
                                        {statusOpcoes.map(s => (
                                            <option key={s.id} value={s.nome}>{s.nome.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
