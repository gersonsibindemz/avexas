import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { OrdemManutencao } from '../../types';
import { Modal } from '../common/Modal';
import { CadastrarOrdemView } from './CadastrarOrdemView';
import { EditarOrdemView } from './EditarOrdemView';
import { supabase } from '../../lib/supabaseClient';

export const OrdensManutencaoView: React.FC = () => {
  const [ordens, setOrdens] = useState<OrdemManutencao[]>([]);
  const [statusOpcoes, setStatusOpcoes] = useState<{id: number, nome: string}[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemManutencao | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrdens();
  }, []);

  const fetchOrdens = async () => {
    setLoading(true);
    const [
      { data: ordens, error: oError },
      { data: equipamentos, error: eError },
      { data: tipos, error: tError },
      { data: status, error: sError },
      { data: profiles, error: pError }
    ] = await Promise.all([
      supabase.from('ordens_manutencao').select('*'),
      supabase.from('equipamentos').select('id, nome'),
      supabase.from('tipos_manutencao').select('id, nome'),
      supabase.from('status_ordem').select('id, nome'),
      supabase.from('profiles').select('id, name, surname')
    ]);

    if (oError) {
      console.error('Error fetching ordens:', oError);
    } else if (ordens) {
      const mapped = ordens.map((item: any) => {
        const eq = equipamentos?.find((e: any) => e.id === item.equipamento_id);
        const tipo = tipos?.find((t: any) => t.id === item.tipo_id);
        const stat = status?.find((s: any) => s.id === item.status_id);
        const prof = profiles?.find((p: any) => p.id === item.tecnico_id);
        return {
          ...item,
          equipamento_nome: eq?.nome || '',
          tipo: tipo?.nome || '',
          status: stat?.nome || '',
          tecnico: prof ? `${prof.name} ${prof.surname}`.trim() : ''
        };
      });
      setOrdens(mapped);
      if (status) setStatusOpcoes(status);
      if (equipamentos) setEquipamentos(equipamentos);
      if (tipos) setTipos(tipos);
      if (profiles) setProfiles(profiles);
    }
    setLoading(false);
  };

  const filteredOrdens = ordens.filter(ordem => 
    (ordem.equipamento_nome || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === '' || ordem.status === statusFilter)
  );

  const handleSaveOrdem = (novaOrdem: OrdemManutencao) => {
    const eq = equipamentos.find((e: any) => e.id === novaOrdem.equipamento_id);
    const tipo = tipos.find((t: any) => t.id === novaOrdem.tipo_id);
    const stat = statusOpcoes.find((s: any) => s.id === novaOrdem.status_id);
    const prof = profiles.find((p: any) => p.id === novaOrdem.tecnico_id);

    const novaOrdemMapped: OrdemManutencao = {
      ...novaOrdem,
      equipamento_nome: eq?.nome || '',
      tipo: tipo?.nome || '',
      status: stat?.nome || '',
      tecnico: prof ? `${prof.name} ${prof.surname}`.trim() : ''
    };

    setOrdens([...ordens, novaOrdemMapped]);
    setIsRegistering(false);
  };

  const handleUpdateOrdem = (ordemAtualizada: OrdemManutencao) => {
    setOrdens(ordens.map(o => o.id === ordemAtualizada.id ? ordemAtualizada : o));
    setIsEditModalOpen(false);
    setSelectedOrdem(null);
  };

  if (isRegistering) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-auto border border-slate-200">
          <CadastrarOrdemView onCancel={() => setIsRegistering(false)} onSave={handleSaveOrdem} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Ordens de Manutenção</h1>
        <button onClick={() => setIsRegistering(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm font-medium transition-colors">
          <Plus size={16} />
          Nova Ordem
        </button>
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Pesquisar por equipamento..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-slate-300 p-2 text-sm w-64"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 p-2 text-sm w-48"
        >
          <option value="">Todos os Status</option>
          {statusOpcoes.map(s => <option key={s.id} value={s.nome}>{s.nome}</option>)}
        </select>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Ordem de Manutenção">
        {selectedOrdem && (
          <EditarOrdemView 
            ordem={selectedOrdem} 
            statusOpcoes={statusOpcoes}
            onCancel={() => setIsEditModalOpen(false)} 
            onSave={handleUpdateOrdem} 
          />
        )}
      </Modal>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Carregando...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Equipamento</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Tipo</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Técnico</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrdens.map((ordem) => (
                <tr key={ordem.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">{ordem.equipamento_nome}</td>
                  <td className="px-6 py-4 text-slate-600">{ordem.tipo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ordem.status === 'Aberta' ? 'bg-blue-50 text-blue-700' : ordem.status === 'Em Andamento' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {ordem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{ordem.tecnico}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => { setSelectedOrdem(ordem); setIsEditModalOpen(true); }}
                      className="text-sky-600 hover:text-sky-800 font-medium"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
