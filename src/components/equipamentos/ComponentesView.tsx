import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Filter, MoreVertical, Box, Plus } from 'lucide-react';
import { ActionsMenu } from './ActionsMenu';
import { CadastrarComponenteView } from './CadastrarComponenteView';
import { DetalhesComponenteView } from './DetalhesComponenteView';
import { supabase } from '../../lib/supabaseClient';
import { Equipamento, Componente, AdvancedFilters } from '../../types';

interface FlatComponente extends Componente {
  equipamentoNome: string;
}

interface ComponentesViewProps {
  selectedComponentId?: string | null;
}

export const ComponentesView: React.FC<ComponentesViewProps> = ({ selectedComponentId }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedComponente, setSelectedComponente] = useState<{comp: Componente, eqNome: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filteredComponentes, setFilteredComponentes] = useState<FlatComponente[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAdvancedFiltersExpanded, setIsAdvancedFiltersExpanded] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({ sort: 'name-asc', locations: [], status: [] });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  useEffect(() => {
    const fetchEquipamentos = async () => {
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
    };

    fetchEquipamentos();
  }, []);

  const ALL_COMPONENTS: FlatComponente[] = equipamentos.flatMap(eq =>
    eq.componentes.map(comp => ({
      ...comp,
      equipamentoNome: eq.nome
    }))
  );

  const dropdownResults = isDropdownOpen && searchQuery.length > 0 ? ALL_COMPONENTS.filter(comp => 
      comp.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
      comp.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const availableLocations = useMemo(() => Array.from(new Set(ALL_COMPONENTS.map(comp => comp.localizacao))), [ALL_COMPONENTS]);

  const displayComponentes = React.useMemo(() => {
      let list = filteredComponentes || ALL_COMPONENTS;
      
      if (selectedStatus) {
          list = list.filter(comp => comp.status === selectedStatus);
      }
      
      if (advancedFilters.status.length > 0) {
          list = list.filter(comp => advancedFilters.status.includes(comp.status));
      }
      
      if (advancedFilters.locations.length > 0) {
          list = list.filter(comp => advancedFilters.locations.includes(comp.localizacao));
      }

      list = [...list].sort((a,b) => {
          if (advancedFilters.sort === 'name-asc') return a.nome.localeCompare(b.nome);
          if (advancedFilters.sort === 'name-desc') return b.nome.localeCompare(a.nome);
          if (advancedFilters.sort === 'date-asc') return new Date(a.dataAquisicao).getTime() - new Date(b.dataAquisicao).getTime();
          if (advancedFilters.sort === 'date-desc') return new Date(b.dataAquisicao).getTime() - new Date(a.dataAquisicao).getTime();
          return 0;
      });

      return list;
  }, [ALL_COMPONENTS, filteredComponentes, selectedStatus, advancedFilters]);

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

  const handleSearch = () => {
    setIsDropdownOpen(false);
    if (searchQuery === '') {
        setFilteredComponentes(null);
        return;
    }
    const filtered = ALL_COMPONENTS.filter(comp => 
        comp.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        comp.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.equipamentoNome.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredComponentes(filtered);
  };

  const handleSelect = (comp: FlatComponente) => {
    setSearchQuery(comp.nome);
    setIsDropdownOpen(false);
    setSelectedIndex(null);
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

  useEffect(() => {
      if (selectedComponentId) {
          const comp = ALL_COMPONENTS.find(c => c.id === selectedComponentId);
          if (comp) {
              setSelectedComponente({ comp, eqNome: comp.equipamentoNome });
          }
      }
  }, [selectedComponentId, equipamentos]);

  const saveComponente = (equipamentoId: string, comp: Componente) => {
    setEquipamentos(equipamentos.map(eq => {
        if (eq.id === equipamentoId) {
            return { ...eq, componentes: [...eq.componentes, comp] };
        }
        return eq;
    }));
    setIsRegistering(false);
  };

  const handleAction = (action: string, comp: FlatComponente) => {
    if (action === 'Ver Detalhes da Componente') {
      setSelectedComponente({ comp, eqNome: comp.equipamentoNome });
    }
  };

  const toggleActionsMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (selectedComponente) {
    return <DetalhesComponenteView componente={selectedComponente.comp} equipamentoNome={selectedComponente.eqNome} onClose={() => setSelectedComponente(null)} />;
  }

  if (isRegistering) {
    return <CadastrarComponenteView onCancel={() => setIsRegistering(false)} onSave={saveComponente} equipamentos={equipamentos} />;
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Todos os Componentes</h1>
        <button onClick={() => setIsRegistering(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm font-medium transition-colors">
          <Plus size={16} />
          Nova Componente
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
                      {dropdownResults.map((comp, index) => (
                          <div 
                            key={comp.id} 
                            className={`px-4 py-2 cursor-pointer text-sm ${index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                            onClick={() => handleSelect(comp)}
                          >
                              <span className="font-medium text-slate-700">{comp.nome}</span>
                              <span className="text-slate-400 ml-2 text-xs">({comp.equipamentoNome}) - {comp.codigo}</span>
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
              <th className="px-6 py-4 font-semibold text-slate-700">Código</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Nome da Componente</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Equipamento</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Localização</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayComponentes.map(comp => (
              <tr key={comp.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">{comp.codigo}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Box size={16} className="text-slate-400" />
                    {comp.nome}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{comp.equipamentoNome}</td>
                <td className="px-6 py-4 text-slate-600">{comp.localizacao}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium ${comp.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : comp.status === 'Manutenção' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                    {comp.status}
                  </span>
                </td>
                <td className="px-6 py-4 relative">
                  <button 
                    ref={activeMenuId === comp.id ? menuButtonRef : null}
                    onClick={(e) => toggleActionsMenu(e, comp.id)} 
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <MoreVertical size={16} />
                  </button>
                  <ActionsMenu
                      isOpen={activeMenuId === comp.id}
                      onClose={() => setActiveMenuId(null)}
                      anchorRef={menuButtonRef}
                      onAction={(action) => handleAction(action, comp)}
                      actions={[
                        'Ver Detalhes da Componente',
                        'Editar Componente',
                        'Gerar QR Code',
                        'Baixar Manuais/Anexos',
                        'Histórico de Manutenção',
                        'Excluir Componente'
                      ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
