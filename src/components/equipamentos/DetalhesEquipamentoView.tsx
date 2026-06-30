import React from 'react';
import { X } from 'lucide-react';
import { Equipamento } from './TodosEquipamentosView';

interface DetalhesEquipamentoProps {
  equipamento: Equipamento;
  onClose: () => void;
}

export const DetalhesEquipamentoView: React.FC<DetalhesEquipamentoProps> = ({ equipamento, onClose }) => {
  return (
    <div className="flex-1 p-6 bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Detalhes do Equipamento: {equipamento.nome}</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium text-slate-500">Nome:</label><p className="text-slate-900">{equipamento.nome}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Código:</label><p className="text-slate-900">{equipamento.codigo}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Localização:</label><p className="text-slate-900">{equipamento.localizacao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Status:</label><p className="text-slate-900">{equipamento.status}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Categoria:</label><p className="text-slate-900">{equipamento.categoria}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Fabricante:</label><p className="text-slate-900">{equipamento.fabricante}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Modelo:</label><p className="text-slate-900">{equipamento.modelo}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Número de Série:</label><p className="text-slate-900">{equipamento.numeroSerie}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Ano de Fabricação:</label><p className="text-slate-900">{equipamento.anoFabricacao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Data de Aquisição:</label><p className="text-slate-900">{equipamento.dataAquisicao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Prazo de Garantia:</label><p className="text-slate-900">{equipamento.prazoGarantia}</p></div>
      </div>
    </div>
  );
};
