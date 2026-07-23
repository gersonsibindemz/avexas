import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PlanoManutencao } from '../../types';

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
        <div className="flex flex-col gap-1 mt-1">
          {planosDoDia.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlanId(p.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  setSelectedPlanId(p.id);
                }
              }}
              className="text-[10px] bg-sky-100 text-sky-800 p-0.5 rounded truncate text-left w-full hover:bg-sky-200 cursor-pointer"
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
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex-1">
        <Calendar tileContent={tileContent} className="w-full border-0" />
      </div>
      <div className="w-full md:w-80 border-l border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Detalhes do Plano</h3>
        {selectedPlan ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600"><strong className="text-slate-900">Título:</strong> {selectedPlan.titulo}</p>
            <p className="text-sm text-slate-600"><strong className="text-slate-900">Ordem:</strong> {selectedPlan.ordem_descricao || 'N/A'}</p>
            <p className="text-sm text-slate-600"><strong className="text-slate-900">Descrição:</strong> {selectedPlan.descricao}</p>
            <p className="text-sm text-slate-600"><strong className="text-slate-900">Data:</strong> {selectedPlan.data_inicio}</p>
            <p className="text-sm text-slate-600"><strong className="text-slate-900">Status:</strong> {selectedPlan.status}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Clique em um plano no calendário para ver os detalhes.</p>
        )}
      </div>
    </div>
  );
};
