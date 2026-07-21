import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PlanoManutencao } from '../../types';

interface Props {
  planos: PlanoManutencao[];
}

export const CalendarioPlanoView: React.FC<Props> = ({ planos }) => {
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const planosDoDia = planos.filter((p) => p.data_inicio === dateString);
      return (
        <div className="flex flex-col gap-1 mt-1">
          {planosDoDia.map((p) => (
            <div key={p.id} className="text-[10px] bg-sky-100 text-sky-800 p-0.5 rounded truncate">
              {p.titulo || 'Plano'}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Calendar tileContent={tileContent} className="w-full border-0" />
    </div>
  );
};
