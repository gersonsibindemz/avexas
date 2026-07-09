import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { OrdemManutencao, StatusOrdem } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface EditarOrdemProps {
  ordem: OrdemManutencao;
  statusOpcoes: StatusOrdem[];
  onCancel: () => void;
  onSave: (ordemAtualizada: OrdemManutencao) => void;
}

export const EditarOrdemView: React.FC<EditarOrdemProps> = ({ ordem, statusOpcoes, onCancel, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [statusId, setStatusId] = useState(ordem.status_id);
  const [tempoGasto, setTempoGasto] = useState(ordem.tempo_gasto || '');
  const [custo, setCusto] = useState(ordem.custo || 0);
  const [observacoes, setObservacoes] = useState(ordem.observacoes || '');
  const [file, setFile] = useState<File | null>(null);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    
    let anexo_url = ordem.anexo_relatorio_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${ordem.id}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ordens-relatorios')
        .upload(fileName, file);

      if (uploadError) {
        setError('Erro ao enviar anexo.');
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('ordens-relatorios')
        .getPublicUrl(uploadData.path);
      
      anexo_url = urlData.publicUrl;
    }
    
    const payload = {
        status_id: statusId,
        tempo_gasto: tempoGasto,
        custo: custo,
        observacoes: observacoes,
        anexo_relatorio_url: anexo_url || null
    };
    
    console.log('Update Payload:', payload);
    
    const { data, error: updateError } = await supabase
      .from('ordens_manutencao')
      .update(payload)
      .eq('id', ordem.id)
      .select();

    if (updateError) {
      console.error('Database update error:', updateError);
      console.error('Update payload:', payload);
      setError(`Erro ao atualizar ordem: ${updateError.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      onSave({ ...ordem, ...data[0], status: statusOpcoes.find(s => s.id === statusId)?.nome || '' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Status</label>
        <select value={statusId} onChange={(e) => setStatusId(Number(e.target.value))} className="mt-1 block w-full border border-slate-300 p-2 text-sm">
          {statusOpcoes.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Tempo Gasto</label>
        <input type="text" value={tempoGasto} onChange={(e) => setTempoGasto(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Custo</label>
        <input type="number" value={custo} onChange={(e) => setCusto(Number(e.target.value))} className="mt-1 block w-full border border-slate-300 p-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Observações</label>
        <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2 text-sm" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Anexo de Relatório</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200">Cancelar</button>
        <button onClick={handleUpdate} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400">
          {loading && <Loader2 className="animate-spin" size={16} />}
          {loading ? 'Salvando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  );
};
