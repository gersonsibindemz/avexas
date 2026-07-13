import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { OrdemManutencao, TipoManutencao, PrioridadeManutencao, StatusOrdem, Equipamento, Profile } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface CadastrarOrdemProps {
  onCancel: () => void;
  onSave: (ordem: OrdemManutencao) => void;
}

export const CadastrarOrdemView: React.FC<CadastrarOrdemProps> = ({ onCancel, onSave }) => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [tecnicos, setTecnicos] = useState<Profile[]>([]);
  const [tipos, setTipos] = useState<TipoManutencao[]>([]);
  const [prioridades, setPrioridades] = useState<PrioridadeManutencao[]>([]);
  const [statusOpcoes, setStatusOpcoes] = useState<StatusOrdem[]>([]);
  
  const [equipamentoId, setEquipamentoId] = useState('');
  const [tipoId, setTipoId] = useState<number>();
  const [prioridadeId, setPrioridadeId] = useState<number>();
  const [statusId, setStatusId] = useState<number>();
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [tecnicoId, setTecnicoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for materials
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<{nome: string, quantidade: number}[]>([]);
  const [novoMaterial, setNovoMaterial] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState(0);

  const addMaterialLocal = () => {
    if (!novoMaterial || novaQuantidade <= 0) return;
    setMateriaisSelecionados([...materiaisSelecionados, { nome: novoMaterial, quantidade: novaQuantidade }]);
    setNovoMaterial('');
    setNovaQuantidade(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [equipamentosRes, tecnicosRes, tiposRes, prioridadesRes, statusRes] = await Promise.all([
        supabase.from('equipamentos').select('id, nome'),
        supabase.from('profiles').select('id, name, surname, role'),
        supabase.from('tipos_manutencao').select('*'),
        supabase.from('prioridades_manutencao').select('*'),
        supabase.from('status_ordem').select('*')
      ]);

      if (equipamentosRes.data) setEquipamentos(equipamentosRes.data);
      if (tecnicosRes.data) {
        const filtered = tecnicosRes.data.filter((p: any) => p.role === 'Técnico de Manutenção');
        setTecnicos(filtered);
      }
      if (tiposRes.data) {
        setTipos(tiposRes.data);
      }
      if (prioridadesRes.data) {
        setPrioridades(prioridadesRes.data);
      }
      if (statusRes.data) {
        setStatusOpcoes(statusRes.data);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!equipamentoId || !tecnicoId || !tipoId || !prioridadeId || !statusId) return;
    
    setLoading(true);
    setError(null);
    
    const { data: novaOrdem, error: insertError } = await supabase
      .from('ordens_manutencao')
      .insert([
        {
          equipamento_id: equipamentoId,
          tipo_id: tipoId,
          prioridade_id: prioridadeId,
          status_id: statusId,
          descricao,
          data_execucao: data,
          tecnico_id: tecnicoId
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting ordem:', insertError);
      setError('Erro ao salvar ordem: ' + insertError.message);
      setLoading(false);
      return;
    }

    onSave(novaOrdem);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold text-slate-800">Nova Ordem de Manutenção</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">Equipamento</label>
          <select value={equipamentoId} onChange={(e) => setEquipamentoId(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2 text-sm">
            <option value="">Selecione um equipamento</option>
            {equipamentos.map(e => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tipo</label>
          <select value={tipoId} onChange={(e) => setTipoId(Number(e.target.value))} className="mt-1 block w-full border border-slate-300 p-2 text-sm">
            <option value="">Selecione</option>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Prioridade</label>
          <select value={prioridadeId} onChange={(e) => setPrioridadeId(Number(e.target.value))} className="mt-1 block w-full border border-slate-300 p-2 text-sm">
            <option value="">Selecione</option>
            {prioridades.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select value={statusId} onChange={(e) => setStatusId(Number(e.target.value))} className="mt-1 block w-full border border-slate-300 p-2 text-sm">
            <option value="">Selecione</option>
            {statusOpcoes.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2 text-sm" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Data de Execução</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Técnico</label>
          <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2 text-sm">
            <option value="">Selecione um técnico</option>
            {tecnicos.map(t => (
              <option key={t.id} value={t.id}>{`${t.name} ${t.surname}`}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <label className="block text-sm font-medium text-slate-700">Materiais Utilizados (Local)</label>
        <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Nome do material" value={novoMaterial} onChange={(e) => setNovoMaterial(e.target.value)} className="border border-slate-300 p-2 text-sm flex-1" />
            <input type="number" placeholder="Qtd" value={novaQuantidade} onChange={(e) => setNovaQuantidade(Number(e.target.value))} className="border border-slate-300 p-2 text-sm w-20" />
            <button type="button" onClick={addMaterialLocal} className="bg-sky-600 text-white px-4 py-2 text-sm hover:bg-sky-700">Add</button>
        </div>
        <table className="mt-4 w-full text-sm text-left text-slate-600">
            <thead>
                <tr>
                    <th className="font-medium p-2">Material</th>
                    <th className="font-medium p-2">Quantidade</th>
                </tr>
            </thead>
            <tbody>
                {materiaisSelecionados.map((m, i) => (
                    <tr key={i} className="border-b">
                        <td className="p-2">{m.nome}</td>
                        <td className="p-2">{m.quantidade}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      <div className="flex justify-end gap-4 items-center mt-6">
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200">Cancelar</button>
        <button onClick={handleSave} disabled={loading || !equipamentoId || !tecnicoId || !tipoId || !prioridadeId || !statusId} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400">
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? 'Salvando...' : 'Salvar Ordem'}
        </button>
      </div>
    </div>
  );
};
