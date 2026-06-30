import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const DashboardView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100/60 flex items-center justify-center text-sky-600 mb-5 shadow-sm shadow-sky-100">
        <LayoutDashboard size={32} className="stroke-[1.5]" />
      </div>
      <h2 className="font-sans font-bold text-2xl text-slate-800 tracking-tight mb-2">
        Painél Geral
      </h2>
      <p className="font-inter text-slate-500 text-sm max-w-md leading-relaxed mb-6">
        Sua área principal de controle e análise de métricas operacionais.
      </p>
    </div>
  );
};
