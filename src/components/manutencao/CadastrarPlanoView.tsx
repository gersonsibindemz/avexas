import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { OrdemManutencao } from '../../types';

interface CadastrarPlanoProps {
  onCancel: () => void;
  onSave: () => void;
}

export const CadastrarPlanoView: React.FC<CadastrarPlanoProps> = ({ onCancel, onSave }) => {
  const [ordens, setOrdens] = useState<OrdemManutencao[]>([]);
  const [ordemId, setOrdemId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('ordens_manutencao').select('id, descricao').then(({ data }) => {
        if(data) setOrdens(data);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('planos_manutencao').insert([{
        ordem_id: ordemId,
        titulo,
        descricao,
        data_inicio: dataInicio,
        data_fim: dataFim,
        status: 'planejado'
    }]);
    
    if (error) {
      console.error('Error saving plan:', error);
      alert('Erro ao salvar plano: ' + error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Título</label>
          <input 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
            placeholder="Título do plano..." 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Ordem de Manutenção</label>
          <select 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
            value={ordemId} 
            onChange={(e) => setOrdemId(e.target.value)}
          >
              <option value="">Selecione uma ordem</option>
              {ordens.map(o => <option key={o.id} value={o.id}>{o.descricao}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Descrição</label>
          <textarea 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
            placeholder="Descreva o plano..." 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Data de Início</label>
            <input 
              type="date" 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
              value={dataInicio} 
              onChange={(e) => setDataInicio(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Data de Fim</label>
            <input 
              type="date" 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border" 
              value={dataFim} 
              onChange={(e) => setDataFim(e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button 
          onClick={onCancel} 
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Salvar'}
        </button>
      </div>
    </div>
  );
};
