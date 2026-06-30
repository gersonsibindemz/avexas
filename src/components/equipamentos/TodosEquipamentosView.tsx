import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Layers, Plus, Search, Filter, ChevronRight, ChevronDown, MoreVertical, Folder, CornerDownRight, Box } from 'lucide-react';
import { ActionsMenu } from './ActionsMenu';
import { CadastrarEquipamentoView } from './CadastrarEquipamentoView';
import { DetalhesEquipamentoView } from './DetalhesEquipamentoView';
import { SummaryBar } from './SummaryBar';
import { supabase } from '../../lib/supabaseClient';
import { Equipamento, AdvancedFilters } from '../../types';

export const TodosEquipamentosView: React.FC<{onNavigateToComponent: (id: string) => void}> = ({ onNavigateToComponent }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedEquipamentoId, setSelectedEquipamentoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredEquipamentos, setFilteredEquipamentos] = useState<Equipamento[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAdvancedFiltersExpanded, setIsAdvancedFiltersExpanded] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({ sort: 'name-asc', locations: [], status: [] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipamentos')
        .select(`
          *,
          componentes (*)
        `);
      
      if (error) {
        console.error('Error fetching equipamentos:', error);
      } else {
        setEquipamentos(data || []);
      }
      setLoading(false);
    };

    fetchEquipamentos();
  }, []);

  const allItems = React.useMemo(() => {
    const items: { id: string, name: string, type: 'equipamento' | 'componente', codigo: string, eqId?: string }[] = [];
    equipamentos.forEach(eq => {
        items.push({ id: eq.id, name: eq.nome, type: 'equipamento', codigo: eq.codigo });
        eq.componentes.forEach(comp => {
            items.push({ id: comp.id, name: comp.nome, type: 'componente', codigo: comp.codigo, eqId: eq.id });
        });
    });
    return items;
  }, [equipamentos]);

  const dropdownResults = isDropdownOpen && searchQuery.length > 0 ? allItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleSearch = async () => {
    setIsDropdownOpen(false);
    setLoading(true);
    
    if (searchQuery === '') {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('*, componentes (*)');
        if (!error) setEquipamentos(data || []);
        setLoading(false);
        return;
    }

    const { data, error } = await supabase
      .from('equipamentos')
      .select('*, componentes (*)')
      .or(`nome.ilike.%${searchQuery}%,codigo.ilike.%${searchQuery}%,componentes.nome.ilike.%${searchQuery}%,componentes.codigo.ilike.%${searchQuery}%`);

    if (error) {
        console.error('Error searching equipamentos:', error);
    } else {
        setEquipamentos(data || []);
        if (data && data.length > 0) {
            const newExpanded: Record<string, boolean> = {};
            data.forEach(eq => newExpanded[eq.id] = true);
            setExpandedRows(newExpanded);
        }
    }
    setLoading(false);
  };

  const handleSelect = (item: typeof allItems[0]) => {
      setSearchQuery(item.name);
      setIsDropdownOpen(false);
      setSelectedIndex(null);
      
      // Removed automatic filtering here to respect user requirement:
      // "depois clicar no botão pesquisar para que a tabela exiba os dados pesquisados."
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isDropdownOpen || dropdownResults.length === 0) return;

      if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev === null || prev >= dropdownResults.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev === null || prev <= 0 ? dropdownResults.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedIndex !== null) {
              handleSelect(dropdownResults[selectedIndex]);
          } else {
              handleSearch();
          }
      }
  };

  const availableLocations = useMemo(() => Array.from(new Set(equipamentos.map(eq => eq.localizacao))), [equipamentos]);

  const displayEquipamentos = React.useMemo(() => {
      let list = filteredEquipamentos || equipamentos;
      
      if (selectedStatus) {
          list = list.filter(eq => eq.status === selectedStatus);
      }
      
      if (advancedFilters.status.length > 0) {
          list = list.filter(eq => advancedFilters.status.includes(eq.status));
      }
      
      if (advancedFilters.locations.length > 0) {
          list = list.filter(eq => advancedFilters.locations.includes(eq.localizacao));
      }

      list = [...list].sort((a,b) => {
          if (advancedFilters.sort === 'name-asc') return a.nome.localeCompare(b.nome);
          if (advancedFilters.sort === 'name-desc') return b.nome.localeCompare(a.nome);
          if (advancedFilters.sort === 'date-asc') return new Date(a.dataAquisicao).getTime() - new Date(b.dataAquisicao).getTime();
          if (advancedFilters.sort === 'date-desc') return new Date(b.dataAquisicao).getTime() - new Date(a.dataAquisicao).getTime();
          return 0;
      });

      return list;
  }, [equipamentos, filteredEquipamentos, selectedStatus, advancedFilters]);

  const toggleLocation = (loc: string) => {
    setAdvancedFilters(prev => ({
        ...prev,
        locations: prev.locations.includes(loc) ? prev.locations.filter(l => l !== loc) : [...prev.locations, loc]
    }));
  };

  const toggleStatusAdvanced = (status: string) => {
    setAdvancedFilters(prev => ({
        ...prev,
        status: prev.status.includes(status) ? prev.status.filter(s => s !== status) : [...prev.status, status]
    }));
  };

  const saveEquipamento = (eq: Equipamento) => {
    if (editingEquipamento) {
      setEquipamentos(equipamentos.map(e => e.id === eq.id ? eq : e));
      setEditingEquipamento(null);
    } else {
      setEquipamentos([...equipamentos, eq]);
      setIsRegistering(false);
    }
  };

  const handleAction = (action: string, id: string) => {
    if (action === 'Ver Detalhes do Equipamento') {
      setSelectedEquipamentoId(id);
    } else if (action === 'Editar Equipamento') {
      const eq = equipamentos.find(e => e.id === id);
      if (eq) setEditingEquipamento(eq);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleActionsMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (selectedEquipamentoId) {
    const eq = equipamentos.find(e => e.id === selectedEquipamentoId);
    return eq ? <DetalhesEquipamentoView equipamento={eq} onClose={() => setSelectedEquipamentoId(null)} /> : null;
  }

  if (isRegistering || editingEquipamento) {
    return <CadastrarEquipamentoView equipamentoToEdit={editingEquipamento || undefined} onCancel={() => { setIsRegistering(false); setEditingEquipamento(null); }} onSave={saveEquipamento} />;
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Todos os Equipamentos</h1>
        <button onClick={() => setIsRegistering(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm font-medium transition-colors">
          <Plus size={16} />
          Novo Equipamento
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center bg-white p-4 border border-slate-200 shadow-sm relative">
        <div className="flex gap-2 items-center flex-1">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" 
              />
              {dropdownResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                      {dropdownResults.map((item, index) => (
                          <div 
                            key={item.id} 
                            className={`px-4 py-2 cursor-pointer text-sm ${index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                            onClick={() => handleSelect(item)}
                          >
                              <span className="font-medium text-slate-700">{item.name}</span>
                              <span className="text-slate-400 ml-2 text-xs">({item.type}) - {item.codigo}</span>
                          </div>
                      ))}
                  </div>
              )}
            </div>
            <button onClick={handleSearch} className="flex items-center gap-2 px-3 py-2 bg-sky-600 text-white text-sm hover:bg-sky-700">
              <Search size={16} /> Pesquisar
            </button>
        </div>
        <div className="flex gap-2 items-center">
            <div className="relative">
                <button onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-sm text-slate-600 hover:bg-slate-100">
                  <Filter size={16} /> {selectedStatus || 'Status'}
                </button>
                {isStatusDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 shadow-lg z-50 w-40">
                        <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm" onClick={() => { setSelectedStatus(null); setIsStatusDropdownOpen(false); }}>Todos</div>
                        {['Ativo', 'Inativo', 'Manutenção'].map(status => (
                            <div key={status} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm" onClick={() => { setSelectedStatus(status); setIsStatusDropdownOpen(false); }}>{status}</div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={() => setIsAdvancedFiltersExpanded(!isAdvancedFiltersExpanded)} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-sm text-slate-600 hover:bg-slate-100">
              Filtros Avançados
            </button>
        </div>
      </div>
      

      <div className="grid grid-cols-2 gap-4 mb-4">
        <SummaryBar table="equipamentos" />
        <div className="border border-slate-200 bg-slate-50" />
      </div>
        {isAdvancedFiltersExpanded && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-row gap-4 items-center">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Ordenar por</label>
                    <select 
                        value={advancedFilters.sort}
                        onChange={(e) => setAdvancedFilters(prev => ({ ...prev, sort: e.target.value as any }))}
                        className="w-full p-2 border rounded text-sm text-slate-700"
                    >
                        <option value="name-asc">Nome (A-Z)</option>
                        <option value="name-desc">Nome (Z-A)</option>
                        <option value="date-asc">Data de Registo (Antigos)</option>
                        <option value="date-desc">Data de Registo (Recentes)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Status</label>
                    <div className="flex flex-wrap gap-2">
                        {['Ativo', 'Inativo', 'Manutenção'].map(status => (
                            <button 
                                key={status}
                                onClick={() => toggleStatusAdvanced(status)}
                                className={`px-3 py-1 text-sm rounded-none ${advancedFilters.status.includes(status) ? 'bg-sky-100 text-sky-800' : 'bg-white border'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Localização</label>
                    <div className="flex flex-wrap gap-2">
                        {availableLocations.map(loc => (
                            <button 
                                key={loc}
                                onClick={() => toggleLocation(loc)}
                                className={`px-3 py-1 text-sm rounded-none ${advancedFilters.locations.includes(loc) ? 'bg-sky-100 text-sky-800' : 'bg-white border'}`}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

      {/* Table */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Equipamento</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Código</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Localização</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayEquipamentos.map((eq) => (
              <React.Fragment key={eq.id}>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <button onClick={() => toggleRow(eq.id)} className="flex items-center gap-2 font-medium text-slate-700 hover:text-sky-700">
                      {expandedRows[eq.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <Folder size={18} className="text-sky-500" />
                      {eq.nome} ({eq.componentes.length})
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{eq.codigo}</td>
                  <td className="px-6 py-4 text-slate-600">{eq.localizacao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${eq.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : eq.status === 'Manutenção' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative">
                    <button 
                      ref={activeMenuId === eq.id ? menuButtonRef : null}
                      onClick={(e) => toggleActionsMenu(e, eq.id)} 
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <MoreVertical size={16} />
                    </button>
                    <ActionsMenu
                        isOpen={activeMenuId === eq.id}
                        onClose={() => setActiveMenuId(null)}
                        anchorRef={menuButtonRef}
                        onAction={(action) => handleAction(action, eq.id)}
                        actions={[
                          'Ver Detalhes do Equipamento',
                          'Editar Equipamento',
                          'Gerar QR Code',
                          'Baixar Manuais/Anexos',
                          'Histórico de Manutenção',
                          'Excluir Equipamento'
                        ]}
                    />
                  </td>
                </tr>
                {expandedRows[eq.id] && eq.componentes.map(comp => (
                  <tr key={comp.id} className="bg-slate-50/50 cursor-pointer hover:bg-slate-100" onClick={() => onNavigateToComponent(comp.id)}>
                    <td className="px-6 py-3 pl-16">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CornerDownRight size={16} className="text-slate-400" />
                        <Box size={16} className="text-slate-400" />
                        {comp.nome}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{comp.codigo}</td>
                    <td className="px-6 py-3 text-slate-500">{comp.localizacao}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${comp.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : comp.status === 'Manutenção' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="px-6 py-3" />
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};
