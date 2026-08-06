import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Calendar as CalendarIcon, Table as TableIcon, Search } from 'lucide-react';
import { PlanoManutencao } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { FormCard } from '../common/FormCard';
import { CadastrarPlanoView } from './CadastrarPlanoView';
import { CalendarioPlanoView } from './CalendarioPlanoView';

export const PlanoManutencaoView: React.FC = () => {
  const [planos, setPlanos] = useState<PlanoManutencao[]>([]);
  const [statusOpcoes, setStatusOpcoes] = useState<{id: string, nome: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setFilterTerm(searchTerm);
    setShowDropdown(false);
    setTimeout(() => setIsSearching(false), 500); // Fake loading
  };

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

  const suggestions = planos.filter(p => (p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || p.ordem_descricao?.toLowerCase().includes(searchTerm.toLowerCase())) && searchTerm.length > 0);
  const filteredPlanos = planos.filter(plano => 
      plano.titulo?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      plano.descricao?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      plano.ordem_descricao?.toLowerCase().includes(filterTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6">
      {isRegistering ? (
        <FormCard title="Cadastrar Novo Plano" onClose={() => setIsRegistering(false)}>
          <CadastrarPlanoView onCancel={() => setIsRegistering(false)} onSave={() => { setIsRegistering(false); fetchPlanos(); }} />
        </FormCard>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
                <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setShowDropdown(true);}}
                      className="border border-slate-300 px-4 py-2 text-sm w-full pr-10"
                    />
                    <button onClick={handleSearch} className="absolute right-0 top-0 h-full px-2 text-slate-500 bg-transparent border-none flex items-center justify-center hover:text-slate-900">
                        {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                    </button>
                    {showDropdown && searchTerm && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-300 rounded shadow-lg z-50">
                          {suggestions.map(s => (
                              <button key={s.id} onClick={() => {setSearchTerm(s.titulo || ''); setShowDropdown(false);}} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm">{s.titulo}</button>
                          ))}
                      </div>
                    )}
                </div>
                <button onClick={() => setIsRegistering(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 hover:bg-sky-700">
                  <Plus size={18} /> Novo Plano
                </button>
            </div>
            <button 
              onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')} 
              className="p-2 text-slate-700 hover:bg-slate-100 rounded"
              title={viewMode === 'table' ? 'Ver Calendário' : 'Ver Tabela'}
            >
              {viewMode === 'table' ? <CalendarIcon size={20} /> : <TableIcon size={20} />}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
          ) : viewMode === 'table' ? (
            <div className="bg-white border border-slate-200">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-3 text-left">Título</th>
                            <th className="p-3 text-left">Ordem</th>
                            <th className="p-3 text-left">Descrição</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlanos.map(plano => (
                            <tr key={plano.id} className="border-b border-slate-100">
                                <td className="p-3">{plano.titulo || 'N/A'}</td>
                                <td className="p-3">{plano.ordem_descricao || 'N/A'}</td>
                                <td className="p-3">{plano.descricao}</td>
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
          ) : (
            <CalendarioPlanoView planos={filteredPlanos} />
          )}
        </>
      )}
    </div>
  );
};
