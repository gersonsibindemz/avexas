import React from 'react';
import { Equipamento } from '../../types';

interface FichaTecnicaProps {
  equipamento: Equipamento;
}

export const FichaTecnicaView: React.FC<FichaTecnicaProps> = ({ equipamento }) => {
  const leftFields = [
    { label: 'Localização', value: equipamento.localizacao || '-' },
    { label: 'Categoria', value: equipamento.categoria || '-' },
    { label: 'Fabricante', value: equipamento.fabricante || '-' },
    { label: 'Número de Série', value: equipamento.numeroSerie || '-' },
    { label: 'Data de Aquisição', value: equipamento.dataAquisicao || '-' },
    { label: 'Criado por', value: equipamento.created_by || 'Sistema' },
    { label: 'Última Atualização', value: equipamento.updated_at ? new Date(equipamento.updated_at).toLocaleDateString() : '-' },
  ];

  const rightFields = [
    { label: 'Status', value: equipamento.status || '-' },
    { label: 'Grupo / Subgrupo', value: equipamento.grupo_subgrupo || '-' },
    { label: 'Modelo', value: equipamento.modelo || '-' },
    { label: 'Ano de Fabricação', value: equipamento.anoFabricacao || '-' },
    { label: 'Prazo de Garantia', value: equipamento.prazoGarantia || '-' },
    { label: 'Data Atual', value: new Date().toLocaleDateString() },
    { label: 'Responsável', value: equipamento.updated_by || '-' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white shadow-lg border border-slate-200 min-h-[1000px]">
      {/* Header */}
      <div className="flex flex-col items-center border-b-2 border-slate-800 pb-6 mb-8 gap-4">
        <div className="w-24 h-24 bg-slate-200 flex items-center justify-center text-xs text-slate-500">LOGO</div>
        <h1 className="text-2xl font-bold text-slate-800 uppercase">Ficha Técnica de Equipamento</h1>
      </div>

      {/* Body Part 1 */}
      <div className="grid grid-cols-2 gap-8 mb-12 items-center">
        <div>
          <span className="block font-medium text-slate-500 text-sm">Equipamento:</span>
          <span className="block text-3xl font-bold text-slate-900">{equipamento.nome}</span>
        </div>
        <div className="w-24 h-24 bg-slate-200 ml-auto flex items-center justify-center text-xs text-slate-500">QR CODE</div>
      </div>

      {/* Body Part 2 */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {/* Left Column */}
        <div className="space-y-4">
          {leftFields.map((field) => (
            <div key={field.label} className="border-b border-slate-200 pb-2">
              <span className="block font-bold text-slate-700 text-sm">{field.label}:</span>
              <span className="block text-slate-900 text-sm">{field.value}</span>
            </div>
          ))}
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          {rightFields.map((field) => (
            <div key={field.label} className="border-b border-slate-200 pb-2">
              <span className="block font-bold text-slate-700 text-sm">{field.label}:</span>
              <span className="block text-slate-900 text-sm">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
