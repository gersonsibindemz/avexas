import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PlanoManutencao } from '../../types';
import { Info } from 'lucide-react';

interface Props {
  planos: PlanoManutencao[];
}

export const CalendarioPlanoView: React.FC<Props> = ({ planos }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = planos.find((p) => p.id === selectedPlanId) || null;

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const planosDoDia = planos.filter((p) => p.data_inicio === dateString);
      return (
        <div className="flex flex-col gap-0.5 mt-1">
          {planosDoDia.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlanId(p.id);
              }}
              className="text-[10px] bg-sky-500 text-white p-0.5 rounded shadow-sm truncate text-left w-full hover:bg-sky-600 transition-colors cursor-pointer"
            >
              {p.titulo || 'Plano'}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
      <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
        <Calendar 
          tileContent={tileContent} 
          className="w-full border-none font-sans" 
          calendarType="gregory"
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Info size={20} className="text-sky-600" />
            Detalhes do Plano
        </h3>
        {selectedPlan ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 font-medium">Título</p>
                <p className="text-base text-slate-900 font-semibold">{selectedPlan.titulo}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 font-medium">Data</p>
                    <p className="text-base text-slate-900 font-semibold">{selectedPlan.data_inicio}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 font-medium">Status</p>
                    <p className="text-base text-sky-700 font-semibold capitalize">{selectedPlan.status.replace('_', ' ')}</p>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 font-medium">Ordem</p>
                <p className="text-base text-slate-900">{selectedPlan.ordem_descricao || 'N/A'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 font-medium">Descrição</p>
                <p className="text-sm text-slate-800 leading-relaxed">{selectedPlan.descricao}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-center italic">
            <p>Selecione um plano no calendário para visualizar seus detalhes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
