import React from 'react';
import { X } from 'lucide-react';
import { AdvancedFilters } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statuses: string[];
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  advancedFilters: AdvancedFilters;
  onAdvancedFiltersChange: (filters: AdvancedFilters) => void;
  availableLocations: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  statuses,
  selectedStatus,
  onStatusChange,
  advancedFilters,
  onAdvancedFiltersChange,
  availableLocations,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800 mb-6">Filtros</h2>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Status Geral</label>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => onStatusChange(null)}
                        className={`px-3 py-1 text-sm ${selectedStatus === null ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        Todos
                    </button>
                    {statuses.map(status => (
                        <button 
                            key={status}
                            onClick={() => onStatusChange(status)}
                            className={`px-3 py-1 text-sm ${selectedStatus === status ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <hr />

            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Ordenar por</label>
                <select 
                    value={advancedFilters.sort}
                    onChange={(e) => onAdvancedFiltersChange({ ...advancedFilters, sort: e.target.value as any })}
                    className="w-full p-2 border rounded text-sm text-slate-700"
                >
                    <option value="name-asc">Nome (A-Z)</option>
                    <option value="name-desc">Nome (Z-A)</option>
                    <option value="date-asc">Data de Registo (Antigos)</option>
                    <option value="date-desc">Data de Registo (Recentes)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Status (Filtros Avançados)</label>
                <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                        <button 
                            key={status}
                            onClick={() => onAdvancedFiltersChange({ 
                                ...advancedFilters, 
                                status: advancedFilters.status.includes(status) 
                                    ? advancedFilters.status.filter(s => s !== status) 
                                    : [...advancedFilters.status, status] 
                            })}
                            className={`px-3 py-1 text-sm ${advancedFilters.status.includes(status) ? 'bg-sky-100 text-sky-800' : 'bg-white border'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Localização</label>
                <div className="flex flex-wrap gap-2">
                    {availableLocations.map(loc => (
                        <button 
                            key={loc}
                            onClick={() => onAdvancedFiltersChange({ 
                                ...advancedFilters, 
                                locations: advancedFilters.locations.includes(loc) 
                                    ? advancedFilters.locations.filter(l => l !== loc) 
                                    : [...advancedFilters.locations, loc] 
                            })}
                            className={`px-3 py-1 text-sm ${advancedFilters.locations.includes(loc) ? 'bg-sky-100 text-sky-800' : 'bg-white border'}`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="bg-sky-600 text-white px-6 py-2 text-sm font-medium">Aplicar</button>
        </div>
      </div>
    </div>
  );
};
