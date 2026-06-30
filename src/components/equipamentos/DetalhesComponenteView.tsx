import React from 'react';
import { X } from 'lucide-react';
import { Componente } from './TodosEquipamentosView';

interface DetalhesComponenteProps {
  componente: Componente;
  equipamentoNome: string;
  onClose: () => void;
}

export const DetalhesComponenteView: React.FC<DetalhesComponenteProps> = ({ componente, equipamentoNome, onClose }) => {
  return (
    <div className="flex-1 p-6 bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Detalhes da Componente: {componente.nome}</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium text-slate-500">Nome:</label><p className="text-slate-900">{componente.nome}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Código:</label><p className="text-slate-900">{componente.codigo}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Equipamento:</label><p className="text-slate-900">{equipamentoNome}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Localização:</label><p className="text-slate-900">{componente.localizacao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Status:</label><p className="text-slate-900">{componente.status}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Categoria:</label><p className="text-slate-900">{componente.categoria}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Fabricante:</label><p className="text-slate-900">{componente.fabricante}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Modelo:</label><p className="text-slate-900">{componente.modelo}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Número de Série:</label><p className="text-slate-900">{componente.numeroSerie}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Ano de Fabricação:</label><p className="text-slate-900">{componente.anoFabricacao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Data de Aquisição:</label><p className="text-slate-900">{componente.dataAquisicao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Prazo de Garantia:</label><p className="text-slate-900">{componente.prazoGarantia}</p></div>
      </div>
    </div>
  );
};
