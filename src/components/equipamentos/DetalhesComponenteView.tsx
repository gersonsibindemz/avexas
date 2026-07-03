import React from 'react';
import { X, Download } from 'lucide-react';
import { Componente } from './TodosEquipamentosView';
import { downloadExcel } from '../../lib/excelExport';

interface DetalhesComponenteProps {
  componente: Componente;
  equipamentoNome: string;
  onClose: () => void;
}

export const DetalhesComponenteView: React.FC<DetalhesComponenteProps> = ({ componente, equipamentoNome, onClose }) => {
  const handleDownload = () => {
    const headersMap = {
      nome: 'Nome',
      codigo: 'Código',
      localizacao: 'Localização',
      status: 'Status',
      categoria: 'Categoria',
      fabricante: 'Fabricante',
      modelo: 'Modelo',
      numeroSerie: 'Número de Série',
      anoFabricacao: 'Ano de Fabricação',
      dataAquisicao: 'Data de Aquisição',
      prazoGarantia: 'Prazo de Garantia',
    };
    const dataToExport = {
        ...componente,
        equipamento: equipamentoNome
    };
    downloadExcel(dataToExport, `Componente_${componente.nome}`, headersMap);
  };

  return (
    <div className="flex-1 p-6 bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Detalhes da Componente: {componente.nome}</h2>
        <div className="flex gap-2">
            <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded">
                <Download size={16} /> Baixar Detalhes
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
            </button>
        </div>
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
      {componente.document_urls && componente.document_urls.length > 0 && (
        <div className="mt-6">
          <label className="text-sm font-medium text-slate-500">Documentos e Imagens:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {componente.document_urls.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-700 underline">
                Arquivo {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
